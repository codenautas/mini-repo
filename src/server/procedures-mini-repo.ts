"use strict";

import { ProcedureDef } from "./types-mini-repo";
import { ProcedureContext, CoreFunctionParameters } from "backend-plus";
export * from "./types-mini-repo";
import * as fs from "fs-extra";

import * as bestGlobals from "best-globals";
import * as likeAr from 'like-ar';

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
    }
];
