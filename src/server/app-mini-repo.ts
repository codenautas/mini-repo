"use strict";
import * as backendPlus from "backend-plus";
import {ProceduresMiniRepo} from "./procedures-mini-repo";
import {ContextRoles} from "./types-mini-repo";
import {defConfig} from "./def-config"

import {usuarios} from "./table-usuarios";
import {dimensiones} from "./table-dimensiones";
import {indicadores} from "./table-indicadores";
import {indicadores_textos} from "./table-indicadores_textos";
import {parametros} from "./table-parametros";
import {Client} from "pg-promise-strict";

import { Context, Request, MenuDefinition, ProcedureContext, CoreFunctionParameters } from "backend-plus";
import { Result } from "range-parser";
import serveContent = require("serve-content");

export type Constructor<T> = new(...args: any[]) => T;
export function emergeAppMiniRepo<T extends Constructor<backendPlus.AppBackend>>(Base:T){
  return class AppMiniRepo extends Base{
    constructor(...args:any[]){ 
        super(args); 
    }
    addSchrödingerServices(mainApp:backendPlus.Express, baseUrl:string){
        super.addSchrödingerServices(mainApp, baseUrl);
        mainApp.use(baseUrl+'/storage',serveContent('local-attachments',{allowedExts:['xlsx', 'png', 'jpg', 'jpeg', 'gif']}));
    }
    addLoggedServices(){
        var be=this;
        this.procedures = this.procedures.map(function(procedureDef){
            if(procedureDef.action=='table_record_save'){
                var originalCoreFunction=procedureDef.coreFunction;
                procedureDef.coreFunction = async function(context:ProcedureContext, parameters:CoreFunctionParameters){
                    var result = await originalCoreFunction.call(be,context,parameters)
                    return result;
                }

            }
            return procedureDef;
        })
        super.addLoggedServices();
    }
    postConfig(){
        super.postConfig();
    }
    configStaticConfig(){
        super.configStaticConfig();
        this.setStaticConfig(defConfig);
    }
    clientIncludes(req:Request, hideBEPlusInclusions:boolean){
        return [
            { type: 'js', module: 'react', modPath: 'umd', file:'react.development.js', fileProduction:'react.production.min.js' },
            { type: 'js', module: 'react-dom', modPath: 'umd', file:'react-dom.development.js', fileProduction:'react-dom.production.min.js' },
            ...super.clientIncludes(req, hideBEPlusInclusions),
            {type:'js' , src:'adapt.js' },
            {type:'js' , src:'matriz.js' },
            {type:'js' , src:'client.js' },
            {type:'css', file:'styles.css'},
        ];
    }
    getContextForDump(){
        return {es:{admin:true, gabinete:true, coordinador:true}, ...super.getContextForDump()};
    }
    getContext(req:Request):Context & ContextRoles{
        var context = super.getContext(req);
        var cr:ContextRoles;
        // @ts-ignore // inicializo vacío pero después agrego todo
        var es:typeof cr.es={};
        if(req.user){
            es.admin       = req.user.rol=='admin';
            es.coordinador = req.user.rol=='coordinador' || es.admin ;
            es.gabinete    = req.user.rol=='gabinete'    || es.coordinador ;
        }
        return {es, ...context};
    }
    async getProcedures(){
        var parentProc = await super.getProcedures();
        return parentProc.concat(ProceduresMiniRepo);
    }
    getMenu(context:Context&ContextRoles){
        var menus:backendPlus.MenuInfoBase[]=[];
        if(context.es.gabinete){
            menus.push(
                {menuType:'menu', name:'configurar', menuContent:[
                    {menuType:'matriz', name:'matriz', selectedByDefault:true},
                    {menuType:'table', name:'indicadores'},
                    {menuType:'table', name:'dimensiones'} ,
                    {menuType:'table', name:'parametros' } ,
                    {menuType:'table', name:'usuarios'   } ,
                    {menuType:'proc',  name:'excel_leer', label:'leer excel' } ,
                    {menuType:'table', name:'indicadores_textos'},
                ]},
            )
        }
        let menu:MenuDefinition = {
            menu:menus
        }
        return <backendPlus.MenuDefinition>menu;
    }
    prepareGetTables(){
        super.prepareGetTables();
        var newList={
            ...this.getTableDefinition,
            dimensiones,
            indicadores,
            indicadores_textos,
            usuarios,
            parametros,
        }
        // @ts-ignore // problema con el parámetro de context. 
        this.getTableDefinition=newList;
    };
  }
}