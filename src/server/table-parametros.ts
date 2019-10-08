"use strict";

import {TableDefinition, TableContext} from "./types-mini-repo"

export function parametros(context:TableContext):TableDefinition{
    var admin = context.es.admin;
    return {
        name:'parametros',
        editable:admin,
        fields:[
            {name:'unico_registro'                 , typeName:'boolean' , nullable:false, defaultValue:true  , editable: false},
            {name:'min_height_px_imagen_matriz'    , typeName:'decimal' , nullable:false, defaultValue:200   , editable: false},
            {name:'max_height_px_imagen_matriz'    , typeName:'decimal' , nullable:false, defaultValue:300   , editable: false},
            {name:'min_width_px_imagen_matriz'     , typeName:'decimal' , nullable:false, defaultValue:250   , editable: false},
            {name:'max_width_px_imagen_matriz'     , typeName:'decimal' , nullable:false, defaultValue:400   , editable: false},
            {name:'min_aspect_ratio_imagen_matriz' , typeName:'decimal' , nullable:false, defaultValue:1.333 , editable: false},
            {name:'max_aspect_ratio_imagen_matriz' , typeName:'decimal' , nullable:false, defaultValue:1.777 , editable: false},
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
