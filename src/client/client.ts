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
        var boton = html.button('Cargar imagen').create();
        depot.rowControls[fieldName].appendChild(boton);
        boton.addEventListener('click', function(){
            var disableKeysFun = function(){
                DialogPromise.defaultOpts.disableKeyboads=true;
            }
            DialogPromise.defaultOpts.disableKeyboads=false;
            var adjuntoDivId = "cargar-adjunto";
            var imgId = "img-adjunto";
            var adjuntoDiv = html.div({id:adjuntoDivId},[]).create();
            var botonAceptar = html.button({}, 'aceptar').create()
            botonAceptar.onclick=function(){
                var img = document.getElementById(imgId) as HTMLImageElement;
                if(img.src){
                    //grabar imagen
                }
                //cerrar dialog
            };
            var botonCancelar = html.button({}, 'cancelar').create()
            botonCancelar.onclick=function(){
                //cerrar dialog
            };
            var mainContainerDiv = html.div({id:'cargar-adjunto-main'},[
                adjuntoDiv,
                botonAceptar,
                botonCancelar
            ]).create();
            var opts = {
                buttonsDef:[]
            };
            confirmPromise(mainContainerDiv,opts).then(disableKeysFun).catch(disableKeysFun);
            previsualizarImagen(imgId, adjuntoDivId);
        });
        return boton;  
    }
}

myOwn.clientSides.bajarAdjunto = {
    update:function(depot:myOwn.Depot, fieldName:string):void{
        let td=depot.rowControls[fieldName];
        td.style.visibility=depot.row.fecha?'visible':'hidden';
    },
    prepare:function(depot:myOwn.Depot, fieldName:string):void{
        let td=depot.rowControls[fieldName];
        let fileName=depot.row.nombre+'.'+depot.row.ext;
        let bajar = html.a({href:'file?id_adjunto='+depot.row.id_adjunto, download:fileName},"bajar").create();
        td.appendChild(bajar);
    }
}

if(window.myStart){
    alert('my-start')
}
