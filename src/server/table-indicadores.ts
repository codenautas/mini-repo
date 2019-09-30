"use strict";

import {TableDefinition, TableContext} from "./types-mini-repo"

export function indicadores(context:TableContext):TableDefinition{
    var puedeEditar = context.es.admin;
    return {
        name:'indicadores',
        editable: puedeEditar,
        fields: [
            {name:'orden_dimension'                                                          , typeName:'integer' , inTable:false},
            {name:'dimension'                , title:'dimensión'                             , typeName:'text' },
            {name:'indicador'                , title:'código indicador'                      , typeName:'text' ,nullable:false},
            {name:'denominacion'             , title:'indicador'                             , typeName:'text' , isName:true},
            {name:'orden'                    , title:'orden'                                 , typeName:'integer' },
            {name:'fte'                      , title:'fuente'                                , typeName:'text'},
            {name:'um'                       , title:'unidad de medida'                      , typeName:'text'},
            {name:'universo'                 , title:'universo'                              , typeName:'text'},
            {name:'def_con'                  , title:'definición conceptual'                 , typeName:'text'},
            {name:'def_ope'                  , title:'definición operativa'                  , typeName:'text'},
            {name:'cob'                      , title:'cobertura'                             , typeName:'text'},
            {name:'desagregaciones'          , title:'desagregaciones'                       , typeName:'text'},
            {name:'uso_alc_lim'              , title:'uso - alcance - limitaciones'          , typeName:'text'},
            {name:'metas'                    , title:'metas'                                 , typeName:'text'},
            {name:'ods'                      , title:'ODS'                                   , typeName:'text'},
        ],
        primaryKey:['indicador'],
        foreignKeys:[
            {references:'dimensiones', fields:['dimension']},
            // {references:'fte'  , fields:['fte']},
            // {references:'um'   , fields:['um']}
        ],
        sql:{
            isTable:true,
            from: `(
                select i.*, d.orden as orden_dimension
                    from indicadores i inner join dimensiones d using (dimension)
            )`
        },
        hiddenColumns:['indicador','orden_dimension','dimension','orden'],
        sortColumns:[{column:'orden_dimension'},{column:'orden'}]
    };
}
