"use strict";

import { ProcedureDef } from "./types-mini-repo";
import { ProcedureContext, CoreFunctionParameters, UploadedFileInfo } from "backend-plus";
export * from "./types-mini-repo";
import * as fs from "fs-extra";
import * as XLSX from "xlsx-style";
import * as Path from "path";

import * as bestGlobals from "best-globals";
import * as likeAr from 'like-ar';
import { indicadores_textos } from "./table-indicadores_textos";
import { dimensiones } from "table-dimensiones";

function json(sql:string, orderby:string){
    return `(SELECT jsonb_agg(to_jsonb(j.*) ORDER BY ${orderby}) from (${sql}) as j)`
}

export const ProceduresMiniRepo : ProcedureDef[] = [
    {
        action:'matriz_traer',
        parameters:[],
        unlogged:true,
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
    },
    {
        action:'archivo_subir',
        progress: true,
        parameters:[
            {name: 'campo'    , typeName: 'text'},
            {name: 'indicador', typeName: 'text'}
        ],
        files:{count:1},
        coreFunction:async function(context, parameters, files){
            const be=context.be;
            const client=context.client;
            const campos:{[k:string]:{
                nombre:string
                sqlset:string
            }}={
                preview:{
                    nombre:'preview',
                    sqlset:`preview = coalesce(preview, $1, replace(archivo,'.xlsx','.png'))`
                },
                archivo:{
                    nombre:'archivo',
                    sqlset:`archivo = coalesce(archivo, $1)`
                },
            };
            if(!(parameters.campo in campos)){
                throw new Error('invalid')
            }
            const campoDef = campos[parameters.campo];
            context.informProgress({message:be.messages.fileUploaded});
            let file = files![0]
            let ext = Path.extname(file.path).substr(1);
            // let originalFilename = file.originalFilename.slice(0,-(ext.length+1));
            let originalFilename = file.originalFilename;
            let filename=`${parameters.indicador}-${originalFilename}`;
            var createResponse = function createResponse(adjuntoRow:any){
                let resultado = {
                    message: `el archivo ${adjuntoRow[campoDef.nombre]} se subió correctamente.`,
                    nombre: adjuntoRow[campoDef.nombre],
                }
                return resultado
            }
            var moveFile = async function moveFile(file:UploadedFileInfo, dimension:string, fileName:string){
                let newPath = `local-attachments/${dimension}/${fileName}`;
                return fs.move(file.path, newPath, { overwrite: true });
            }
            var {row} = await client.query(`
                update indicadores 
                    set ${campoDef.sqlset}
                    where indicador = $2 returning *
            `,
                [filename, parameters.indicador]
            ).fetchUniqueRow();
            var resultado = createResponse(row);
            await moveFile(file,row.dimension, row[campoDef.nombre]);
            return resultado;
        }
    },
];
