"use strict";

import {TableDefinition, TableContext} from "./types-mini-repo"

export function indicadores(context:TableContext):TableDefinition{
    var {es} = context;
    var importando:boolean=true;
    return {
        name:'indicadores',
        editable: es.coordinador,
        fields: [
            {name:'orden_dimension'                                                  , typeName:'integer' , inTable:false, editable:es.admin},
            {name:'dimension'         , title:'dimensión'                            , typeName:'text' , editable:es.admin},
            {name:'indicador'         , title:'código indicador'                     , typeName:'text' , editable:es.coordinador, nullable:false},
            {name:'abreviacion'       , title:'abr. indicador'                       , typeName:'text' , isName:true},
            {name:'denominacion'      , title:'nombre indicador'                     , typeName:'text' },
            {name:'archivo'           , title:'archivo'        , editable:importando , typeName:'text'},
            {name:'preview'           , title:'archivo gráfico', editable:importando , typeName:'text'},
            {name:'orden'             , title:'orden'                                , typeName:'integer' },
            {name:'fuente'            , title:'fuente'                               , typeName:'text'},
            {name:'um'                , title:'unidad de medida'                     , typeName:'text'},
            {name:'universo'          , title:'universo'                             , typeName:'text'},
            {name:'def_con'           , title:'definición conceptual'                , typeName:'text'},
            {name:'def_ope'           , title:'definición operativa'                 , typeName:'text'},
            {name:'cob'               , title:'cobertura'                            , typeName:'text'},
            {name:'desagregaciones'   , title:'desagregaciones'                      , typeName:'text'},
            {name:'uso_alc_lim'       , title:'uso - alcance - limitaciones'         , typeName:'text'},
            {name:'metas'             , title:'metas'                                , typeName:'text'},
            {name:'ods'               , title:'ODS'                                  , typeName:'text'},
            {name:'subir'             , editable:false, clientSide:'subirAdjunto'    , typeName:'text'},
            {name:'bajar'             , editable:false, clientSide:'bajarAdjunto'    , typeName:'text'},
        ],
        primaryKey:['indicador'],
        foreignKeys:[
            {references:'dimensiones', fields:['dimension']},
            // {references:'fuente'  , fields:['fuente']},
            // {references:'um'   , fields:['um']}
        ],
        constraints:[
            {constraintType:'unique', fields:['archivo']},
            {constraintType:'unique', fields:['preview']}
        ],
        sql:{
            isTable:true,
            from: `(
                select i.*, d.orden as orden_dimension
                    from indicadores i inner join dimensiones d using (dimension)
            )`
        },
        hiddenColumns:['orden_dimension','dimension'],
        sortColumns:[{column:'orden_dimension'},{column:'orden'}]
    };
}
