"use strict";

import {TableDefinition, TableContext} from "./types-mini-repo"

export function indicadores_textos(context:TableContext):TableDefinition{
    return {
        name:'indicadores_textos',
        editable: context.es.admin,
        fields: [
            {name:'indicador'        , typeName:'text', nullable:false },
            {name:'tipo'             , typeName:'text', nullable:false },
            {name:'tab'              , typeName:'text', nullable:false },
            {name:'celda'            , typeName:'text', nullable:false },
            {name:'dato'             , typeName:'text', nullable:false }
        ],
        primaryKey:['indicador','tipo', 'tab', 'celda'],
        foreignKeys:[
            {references:'indicadores', fields:['indicador']},
        ]
    };
}
