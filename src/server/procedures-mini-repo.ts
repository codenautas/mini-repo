"use strict";

import { ProcedureDef } from "./types-mini-repo";
import { ProcedureContext, CoreFunctionParameters } from "backend-plus";
export * from "./types-mini-repo";
import * as fs from "fs-extra";
import * as XLSX from "xlsx-style";

import * as bestGlobals from "best-globals";
import * as likeAr from 'like-ar';
import { indicadores_textos } from "./table-indicadores_textos";

function json(sql:string, orderby:string){
    return `(SELECT jsonb_agg(to_jsonb(j.*) ORDER BY ${orderby}) from (${sql}) as j)`
}

export const ProceduresMiniRepo : ProcedureDef[] = [
    {
        action:'matriz_traer',
        parameters:[],
        coreFunction:async function(context:ProcedureContext,_parameters:CoreFunctionParameters){
            var sql3=`
                SELECT *
                    FROM indicadores i 
                    WHERE i.dimension = d.dimension
            `;
            var sql2=`
                SELECT *, ${json(sql3,'orden, indicador')} as indicadores
                    FROM dimensiones d 
            `;
            var sql=json(sql2, 'orden, dimension')
            fs.writeFile('local-sql-core.sql',sql);
            var result = await context.client.query(sql).fetchUniqueValue();
            return {dimensiones:result.value};
        }
    },
    {
        action:'excel_leer',
        parameters:[],
        coreFunction:async function(context:ProcedureContext,_parameters:CoreFunctionParameters){
            var sql=`
                SELECT *
                    FROM indicadores
            `;
            var indicadores = await context.client.query(sql).fetchAll();
            var indicadoresTextosTableDef = context.be.tableDefAdapt(indicadores_textos(context),context);
            var tipo = 'excel';
            for (let indicador of indicadores.rows){
                var content = await fs.readFile(`local-attachments/${indicador.dimension}/${indicador.archivo}`)
                context.informProgress({message:`leyendo archivo ${indicador.archivo}`});
                var wb = XLSX.read(content);
                for(let sheet of wb.SheetNames){
                    var ws = wb.Sheets[sheet];
                    if(ws['!ref']){
                        var range = XLSX.utils.decode_range(ws['!ref']);
                        for(var iColumn=0; iColumn<=range.e.c; iColumn++){
                            for(var iRow=0; iRow<=range.e.r; iRow++){
                                var cellAddress=XLSX.utils.encode_cell({r:iRow, c:iColumn});
                                var cellOfFieldName=ws[cellAddress];
                                if(cellOfFieldName && cellOfFieldName.v){
                                    var value = cellOfFieldName.v.toString().trim();
                                    if(value){
                                        var newRow:{
                                            indicador: string,
                                            tipo: string,
                                            tab: string,
                                            celda: string,
                                            dato: string
                                        } = {
                                            indicador: indicador.indicador,
                                            tipo: tipo,
                                            tab: sheet,
                                            celda: cellAddress,
                                            dato: value
                                        }
                                        var primaryKeyValues = indicadoresTextosTableDef.primaryKey.map(function(pkField){
                                            return newRow[pkField];
                                        });
                                        await context.be.procedure.table_record_save.coreFunction(
                                            context,{
                                                table: indicadoresTextosTableDef.tableName, 
                                                primaryKeyValues,
                                                newRow,
                                                oldRow:[],
                                                status:'update',
                                                insertIfNotUpdate:true,
                                                masive:true
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            };
            return 'ok';
        }
    },{
        action:'archivo_bajar',
        progress: true,
        parameters:[
            {name: 'nombre'   , typeName: 'text'},
            {name: 'dimension', typeName: 'text'}
        ],
        files:{count:1},
        coreFunction:function(context, parameters, files){
            let be=context.be;
            context.informProgress(be.messages.fileUploaded);
            let file = files[0]
            let ext = path.extname(file.path).substr(1);
            let originalFilename = file.originalFilename.slice(0,-(ext.length+1));
            let filename= originalFilename;
            let newPath = `local-attachments/${parameters.dimension}/${parameters.nombre}`;
            var createResponse = function createResponse(adjuntoRow){
                let resultado = {
                    message: 'La subida se realizó correctamente (update)',
                    nombre: adjuntoRow.nombre,
                    nombre_original: adjuntoRow.nombre_original,
                    ext: adjuntoRow.ext,
                    fecha: adjuntoRow.fecha,
                    hora: adjuntoRow.hora,
                    id_adjunto: adjuntoRow.id_adjunto
                }
                return resultado
            }
            var moveFile = function moveFile(file, id_adjunto, extension){
                fs.move(file.path, newPath + id_adjunto + '.' + extension, { overwrite: true });
            }
            return Promise.resolve().then(function(){
                if(parameters.id_adjunto){
                    return context.client.query(`update adjuntos set nombre= $1,nombre_original = $2, ext = $3, ruta = concat('local-attachments/file-',$4::text,'.',$3::text), fecha = now(), hora = date_trunc('seconds',current_timestamp-current_date)
                        where id_adjunto = $4 returning *`,
                        [filename, originalFilename, ext, parameters.id_adjunto]
                    ).fetchUniqueRow().then(function(result){
                        return createResponse(result.row)
                    }).then(function(resultado){
                        moveFile(file,resultado.id_adjunto,resultado.ext);
                        return resultado
                    });
                }else{
                    return context.client.query(`insert into adjuntos (nombre, nombre_original, ext, fecha, hora) values ($1,$2,$3,now(), date_trunc('seconds',current_timestamp-current_date)) returning *`,
                        [filename, originalFilename, ext]
                    ).fetchUniqueRow().then(function(result){
                        return context.client.query(`update adjuntos set ruta = concat('local-attachments/file-',id_adjunto::text,'.',ext)
                            where id_adjunto = $1 returning *`,
                            [result.row.id_adjunto]
                        ).fetchUniqueRow().then(function(result){
                            return createResponse(result.row)
                        }).then(function(resultado){
                            moveFile(file,resultado.id_adjunto,resultado.ext);
                            return resultado
                        });
                    });
                }
            }).catch(function(err){
                console.log('ERROR',err.message);
                throw err;
            });
        }
    },

];
