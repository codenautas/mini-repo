"use strict";
import * as backendPlus from "backend-plus";
import {ProceduresMiniRepo} from "./procedures-mini-repo";
import {ContextRoles} from "./types-mini-repo";
import {defConfig} from "./def-config"
import * as  MiniTools from "mini-tools";
import * as yazl from "yazl";
import * as fs from "fs-extra";
import { changing } from "best-globals";

import {usuarios} from "./table-usuarios";
import {dimensiones} from "./table-dimensiones";
import {indicadores} from "./table-indicadores";
import {indicadores_textos} from "./table-indicadores_textos";
import {parametros} from "./table-parametros";

import { Context, Request, MenuDefinition, ProcedureContext, CoreFunctionParameters } from "backend-plus";
import serveContent = require("serve-content");

async function recurseDir(root:string, base:string, callback:(path:string, fileName:string)=>Promise<void>){
    let files = await fs.readdir(root + base);
    await Promise.all(files.map(async function (fileName:string) {
        var path = base + fileName;
        var stat = await fs.stat(root + path);
        if (stat.isFile()) {
            await callback(root + path, path);
        }else if(stat.isDirectory() && fileName!='.' && fileName!='..'){
            await recurseDir(root, path + '/', callback);
        }
    }));
    
}

export type Constructor<T> = new(...args: any[]) => T;
export function emergeAppMiniRepo<T extends Constructor<backendPlus.AppBackend>>(Base:T){
  return class AppMiniRepo extends Base{
    constructor(...args:any[]){ 
        super(args); 
        // @ts-ignore los mensajes existen en backend-plus!
        var messages = this.messages = this.messages || {};
        this.messages = messages = changing(messages, {
            fileUploaded: 'archivo subido',

        })
    }
    addSchrödingerServices(mainApp:backendPlus.Express, baseUrl:string){
        var be=this;
        super.addSchrödingerServices(mainApp, baseUrl);
        mainApp.get(baseUrl+'/vi',function(req,res,_next){
            // @ts-ignore sé que voy a recibir useragent por los middlewares de Backend-plus
            var {useragent} = req;
            return MiniTools.serveText(be.mainPage({useragent}, false, {skipMenu:true}).toHtmlDoc(),'html')(req,res);
        });
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
        this.app.get('/download/file', async function (req, res) {
            let path = `local-attachments/${req.query.dimension}/${req.query.name}`;
            MiniTools.serveFile(path, {})(req, res);
        });
        this.app.get('/download/all', async function (req, res, next) {
            // @ts-ignore uso mi user!
            var user = req.user;
            if (user == null || user.rol != 'admin') {
                console.log('no está autorizado a bajarse todo', user);
                return next();
            }
            let zip = new yazl.ZipFile();
            zip.outputStream.pipe(res);
            let base = 'local-attachments';
            await recurseDir(base+'/', '', async function(path, fileName){
                return zip.addFile(path, fileName);
            });
            zip.end();
        });
    }
    postConfig(){
        super.postConfig();
    }
    configStaticConfig(){
        super.configStaticConfig();
        this.setStaticConfig(defConfig);
    }
    clientIncludes(req:Request, opts:any){
        var loggedResources=req && opts && !opts.skipMenu ? [
            {type:'js' , src:'client.js' },
        ]:[
            {type:'js' , src:'unlogged.js' },
        ];
        return [
            { type: 'js', module: 'react', modPath: 'umd', file:'react.development.js', fileProduction:'react.production.min.js' },
            { type: 'js', module: 'react-dom', modPath: 'umd', file:'react-dom.development.js', fileProduction:'react-dom.production.min.js' },
            // { type: 'js', module: '@material-ui', modPath: 'core/umd', file:'material-ui.development.js', fileProduction:'material-ui.production.min.js' },
            { type: 'js', module: '@material-ui/core', modPath: 'umd', file:'material-ui.development.js', fileProduction:'material-ui.production.min.js' },
            ...super.clientIncludes(req, opts),
            {type:'css', file:'styles.css'},
            {type:'js' , src:'adapt.js' },
            {type:'js' , src:'matriz.js' },
            {type:'js' , src:'adjuntos.js' },
            {type:'js' , src:'client.js' },
            {type:'css', file:'styles.css'},
            ...loggedResources
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
                {menuType:'menu', name:'ver', menuContent:[
                    {menuType:'matriz', name:'matriz', selectedByDefault:true},
                ], selectedByDefault:true},
                {menuType:'menu', name:'datos', menuContent:[
                    {menuType:'table', name:'dimensiones', selectedByDefault:true} ,
                    {menuType:'table', name:'indicadores'},
                    {menuType:'proc' , name:'excel_leer', label:'publicar' } ,
                ]},
                {menuType:'menu', name:'configurar', menuContent:[
                    {menuType:'table', name:'parametros' } ,
                    {menuType:'table', name:'usuarios'   } ,
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