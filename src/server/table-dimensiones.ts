"use strict";

import {TableDefinition, TableContext} from "./types-mini-repo"

export function dimensiones(context:TableContext):TableDefinition{
    var admin = context.es.admin;
    var coordinador = context.es.coordinador;
    return {
        name:'dimensiones',
        editable: coordinador,
        fields: [
            {name: 'dimension'              ,typeName:'text'      ,nullable:false, editable:admin},
            {name: 'denominacion'           ,typeName:'text'      , isName:true},
            {name: 'abreviacion'            ,typeName:'text'      },
            {name: 'orden'                  ,typeName:'integer'   },
            {name: 'ocultar'                ,typeName:'boolean'   },
            {name: 'icono'                  ,typeName:'text'      },
            {name: 'color'                  ,typeName:'text'      , editable:admin},
        ],
        primaryKey:['dimension'],
        detailTables:[
            {table: 'indicadores', fields:['dimension'], abr:'I', label:'indicadores'}
        ],
        constraints:[
            {constraintType:'unique', fields:['denominacion']},
            {constraintType:'unique', fields:['abreviacion']}
        ],
        sortColumns:[{column:'orden'}]
    }
}
