"use strict";

import {TableDefinition, TableContext} from "./types-mini-repo"

export function parametros(context:TableContext):TableDefinition{
    var admin = context.es.admin;
    return {
        name:'parametros',
        editable:admin,
        fields:[
            {name:'unico_registro'       , typeName:'boolean' , nullable:false, defaultValue:true, editable: false},
        ],
        primaryKey:['unico_registro'],
        constraints:[
            {consName:'unico registro', constraintType:'check', expr:'unico_registro is true'}
        ],
        layout:{
            vertical:true
        }
    };
}
