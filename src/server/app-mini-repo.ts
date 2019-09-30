"use strict";
import * as backendPlus from "backend-plus";
import {ProceduresMiniRepo} from "./procedures-mini-repo";
import {ContextRoles} from "./types-mini-repo";
import {defConfig} from "./def-config"

import {usuarios} from "./table-usuarios";
import {dimensiones} from "./table-dimensiones";
import {indicadores} from "./table-indicadores";
import {parametros} from "./table-parametros";
import {Client} from "pg-promise-strict";

import { Context, Request, MenuDefinition, ProcedureContext, CoreFunctionParameters } from "backend-plus";

export type Constructor<T> = new(...args: any[]) => T;
export function emergeAppMiniRepo<T extends Constructor<backendPlus.AppBackend>>(Base:T){
  return class AppMiniRepo extends Base{
    public jurisdicciones:{jurisdiccion:string, nombre:string, avance:string}[]=[];
    constructor(...args:any[]){ 
        super(args); 
    }
    addSchrödingerServices(mainApp:backendPlus.Express, baseUrl:string){
        super.addSchrödingerServices(mainApp, baseUrl);
    }
    addLoggedServices(){
        var be=this;
        this.procedures = this.procedures.map(function(procedureDef){
            if(procedureDef.action=='table_record_save'){
                var originalCoreFunction=procedureDef.coreFunction;
                procedureDef.coreFunction = async function(context:ProcedureContext, parameters:CoreFunctionParameters){
                    var result = await originalCoreFunction.call(be,context,parameters)
                    if(parameters.table=='jurisdicciones'){
                        await be.leerJurisdiccionesActivas(context.client)
                    }
                    return result;
                }

            }
            return procedureDef;
        })
        super.addLoggedServices();
    }
    postConfig(){
        super.postConfig();
        this.leerJurisdiccionesActivas();
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
        return parentProc.concat(Proceduressigf);
    }
    getMenu(context:Context&ContextRoles){
        var menus:backendPlus.MenuInfoBase[]=[];
        if(context.es.gabinete){
            menus.push(
                {menuType:'table', name:'mi_jurisdiccion', label:'mi jurisdicción'},
                {menuType:'menu', name:'comparacion', label:'comparación', selectedByDefault:true, menuContent:[
                    {menuType:'matriz', name:'matriz', selectedByDefault:true},
                    {menuType:'table', name:'tabla', table:'matriz_jur_ind'},
                    {menuType:'table', name:'indicadores'},
                    {menuType:'table', name:'jurisdicciones'},
                    {menuType:'table', name:'plana', table:'jur_ind'} ,
                ]},
            )
            menus.push(
                {menuType:'menu', name:'configurar', menuContent:[
                    {menuType:'table', name:'agrupacion_principal', label: 'agrupacion principal'} ,
                    {menuType:'table', name:'dimensiones'} ,
                    {menuType:'table', name:'parametros' } ,
                    {menuType:'table', name:'usuarios'   } ,
                ]},
            )
        }
        let menu:MenuDefinition = {
            menu:menus
        }
        return <backendPlus.MenuDefinition>menu;
    }
    async leerJurisdiccionesActivas(client?:Client){
        var be=this;
        if(client){
            be.jurisdicciones = (await client.query('select * from jurisdicciones where avance is not null order by jurisdiccion').fetchAll()).rows;
        }else{
            await this.inTransaction(null, async function(client){
                await be.leerJurisdiccionesActivas(client);
            })
        }
    }
    prepareGetTables(){
        super.prepareGetTables();
        var newList={
            ...this.getTableDefinition,
            dimensiones,
            indicadores,
            usuarios,
            parametros,
        }
        // @ts-ignore // problema con el parámetro de context. 
        this.getTableDefinition=newList;
    };
  }
}