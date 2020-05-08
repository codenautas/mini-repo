"use strict";

import {TableDefinition, TableContext} from "./types-mini-repo"

export function parametros(context:TableContext):TableDefinition{
    var admin = context.es.admin;
    return {
        name:'parametros',
        editable:admin,
        fields:[
            {name:'unico_registro'                 , typeName:'boolean' , nullable:false, defaultValue:true  , editable: false},
            {name:'min_height_px_imagen_matriz'    , typeName:'decimal' , nullable:false, defaultValue:130   , editable: false},
            {name:'max_height_px_imagen_matriz'    , typeName:'decimal' , nullable:false, defaultValue:420   , editable: false},
            {name:'min_width_px_imagen_matriz'     , typeName:'decimal' , nullable:false, defaultValue:240   , editable: false},
            {name:'max_width_px_imagen_matriz'     , typeName:'decimal' , nullable:false, defaultValue:690   , editable: false},
            {name:'min_aspect_ratio_imagen_matriz' , typeName:'decimal' , nullable:false, defaultValue:0.8   , editable: false},
            {name:'max_aspect_ratio_imagen_matriz' , typeName:'decimal' , nullable:false, defaultValue:1.777 , editable: false},
            {name:'nombre_sistema'                 , typeName:'text'    , nullable:false, defaultValue:"Banco de Datos"       },
            {name:'mostrar_codigo_dimension'       , typeName:'boolean' , nullable:false, defaultValue:false                  }
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
