import {html} from "js-to-html";
import * as TypedControls from "typed-controls";
import * as bestGlobals from "best-globals";
import {mostrar} from "../unlogged/matriz";
import {previsualizarImagen} from "./adjuntos";

import * as likeAr from "like-ar";
import * as DialogPromise from "dialog-promise";

var datetime=bestGlobals.datetime;
var changing=bestGlobals.changing;

myOwn.wScreens.matriz=async function(addrParams:any){
    var result = await myOwn.ajax.matriz_traer({});
    mostrar(result);
};

myOwn.clientSides.color_pick={
    update:function update(depot, fieldName){
        depot.rowControls[fieldName].childNodes[0].value=depot.rowControls['color'].getTypedValue()
        return; 
    },
    prepare:function prepare(depot, fieldName){
        var colorPicker=html.input({type:'color'}).create();
        colorPicker.value=depot.rowControls['color'].getTypedValue();
        depot.rowControls[fieldName].innerHTML='';
        depot.rowControls[fieldName].appendChild(
            colorPicker
        );
        colorPicker.onchange=function(){
            depot.rowControls['color'].setTypedValue(colorPicker.value,true)
        }
    }
};

myOwn.autoSetupFunctions.push(
    async function getReferences(){
        if(my.config.config['background-img']){
            document.body.style.backgroundImage='url("'+my.path.img+my.config.config['background-img']+'")';
        }
        if(myOwn.offline && myOwn.offline.mode){
            // @ts-ignore // por alguna razón showLupa figura como readonly
            TypedControls.showLupa=false;
        }else{
            myOwn.cache=myOwn.cache||{};
            // myOwn.cache.tabla1 = likeAr.createIndex(await myOwn.getReference('tabla1').dataReady,'tabla1');
            // @ts-ignore // por alguna razón showLupa figura como readonly
            TypedControls.showLupa=0.5;
        }
    }
);

myOwn.clientSides.subirAdjunto = {
    prepare: function(depot:myOwn.Depot, fieldName:string){
        var botonCargarExcel = html.button('excel').create();
        depot.rowControls[fieldName].appendChild(botonCargarExcel);
        botonCargarExcel.addEventListener('click', async function(){
            var showWithMiniMenu = false;
            var messages = {
                importDataFromFile: 'Seleccione un archivo',
                import: 'Cargar'
            };
            my.dialogUpload(
                ['archivo_subir'], 
                {
                    campo:'archivo',
                    indicador:depot.row.indicador,
                },
                function(result:any){
                    depot.rowControls.archivo.setTypedValue(result.nombre);
                    return result.message;
                },
                showWithMiniMenu,
                messages
            )    
        });
        var botonCargarImagen = html.button('imagen').create();
        depot.rowControls[fieldName].appendChild(botonCargarImagen);
        botonCargarImagen.addEventListener('click', async function(){
            var disableKeysFun = function(){
                DialogPromise.defaultOpts.disableKeyboads=true;
            }
            DialogPromise.defaultOpts.disableKeyboads=false;
            var adjuntoDivId = "cargar-adjunto";
            var imgId = "img-adjunto";
            var adjuntoDiv = html.div({id:adjuntoDivId},[]).create();
            var botonAceptar = html.button({class:'primary-background'}, 'aceptar').create()
            botonAceptar.onclick=async function(){
                var img = document.getElementById(imgId) as HTMLImageElement;
                if(img.src){
                    var result = await my.ajax.archivo_subir({
                        campo:'preview',
                        indicador:depot.row.indicador,
                        files:img.losFiles
                    })
                    depot.rowControls.preview.setTypedValue(result.nombre);
                    mainContainerDiv.dialogPromiseDone();
                }
            };
            var botonCancelar = html.a({class:'danger'}, 'cancelar').create()
            botonCancelar.onclick=function(){
                mainContainerDiv.dialogPromiseDone();
            };
            var mainContainerDiv = html.div({id:'cargar-adjunto-main'},[
                adjuntoDiv,
                botonCancelar,
                botonAceptar,
            ]).create();
            var opts = {
                buttonsDef:[]
            };
            try{
                var resultPromise = confirmPromise(mainContainerDiv,opts)
                previsualizarImagen(imgId, adjuntoDivId);
                await resultPromise; 
            }finally{
                disableKeysFun
            }
        });
    }
}

myOwn.clientSides.bajarAdjunto = {
    update:function(depot:myOwn.Depot, fieldName:string):void{
    },
    prepare:function(depot:myOwn.Depot, fieldName:string):void{
        let td=depot.rowControls[fieldName];
        let imagenFileName=depot.row.preview;
        if(imagenFileName){
            td.appendChild(html.a({class:'link-descarga-archivo', href:`download/file?name=${imagenFileName}&dimension=${depot.row.dimension}`, download:imagenFileName},"imagen").create());
        }
        let excelFileName=depot.row.archivo;
        if(excelFileName){
            td.appendChild(html.a({class:'link-descarga-archivo', href:`download/file?name=${excelFileName}&dimension=${depot.row.dimension}`, download:excelFileName},"excel").create());            
        }
    }
}

if(window.myStart){
}
