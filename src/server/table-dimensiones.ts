"use strict";

import {TableDefinition, TableContext} from "./types-mini-repo"

export function dimensiones(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    return {
        name:'dimensiones',
        editable: admin,
        fields: [
            {name: 'dimension'              ,typeName:'text'      ,nullable:false},
            {name: 'denominacion'           ,typeName:'text'      , title:'dimensión', isName:true},
            {name: 'orden'                  ,typeName:'integer'   },
            {name: 'ocultar'                ,typeName:'boolean'   },
            {name: 'icono'                  ,typeName:'text'      },
        ],
        primaryKey:['dimension'],
        detailTables:[
            {table: 'indicadores', fields:['dimension'], abr:'I', label:'indicadores'}
        ]
    }
}
