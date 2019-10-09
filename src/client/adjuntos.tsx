import * as React from "react";
import * as ReactDOM from "react-dom";

import {ParametrosImagen} from "./client";

const VALID = '✓';
const INVALID = '✗';

const ImagenInfo = function(props:{src:string|undefined, sizeParams:ParametrosImagen, width: number, height:number}){
    var height = props.height;
    var width = props.width;
    var validWidth = width >= props.sizeParams.min_width_px_imagen_matriz && width <= props.sizeParams.max_width_px_imagen_matriz;
    var validHeight = height >= props.sizeParams.min_height_px_imagen_matriz && height <= props.sizeParams.max_height_px_imagen_matriz;
    var validAspectRatio = (width/height) >= props.sizeParams.min_aspect_ratio_imagen_matriz && (width/height) <= props.sizeParams.max_aspect_ratio_imagen_matriz;
    if(props.src){
        return (
            <div id="image-info">
                <div id="image-width-validation">
                    ancho: {width}px 
                    <span className={validWidth?'success':'danger'}> {validWidth?VALID:INVALID + ` (el ancho recomendado es de ${props.sizeParams.min_width_px_imagen_matriz} hasta ${props.sizeParams.max_width_px_imagen_matriz} px)`}</span>
                </div>
                <div id="image-heigth-validation">
                    alto: {height}px 
                    <span className={validHeight?'success':'danger'}> {validHeight?VALID:INVALID + ` (la altura recomendada es de ${props.sizeParams.min_height_px_imagen_matriz} hasta ${props.sizeParams.max_height_px_imagen_matriz} px)`}</span> 
                </div>
                <div id="image-aspect-ratio-validation">
                    aspect ratio: {Math.round(width/height * 100) / 100} 
                    <span className={validAspectRatio?'success':'danger'}> {validAspectRatio?VALID:INVALID + ` (el aspect ratio recomendado es de ${props.sizeParams.min_aspect_ratio_imagen_matriz} hasta ${props.sizeParams.max_aspect_ratio_imagen_matriz})`}</span> 
                </div>
            </div>
        )
    }else{
        return(
            <div className='danger'>Pegar la imagen con Ctrl-V</div>
        )
    }
}

const PrevisualizadorImagen = function(props:{imgId:string, width: number, height:number, autoresize:boolean, src:string|null, sizeParams:ParametrosImagen}){
    const [height, setHeight] = React.useState(props.height);
    const [width, setWidth] = React.useState(props.width);
    const [src, setSrc] = React.useState(props.src||undefined);
    document.onpaste = function(e){ 
        if (e.clipboardData) {
			var items = e.clipboardData.items;
			if (!items) return;
			//access data directly
			var is_image = false;
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					//image
					var blob = items[i].getAsFile();
					var URLObj = window.URL || window.webkitURL;
                    var source = URLObj.createObjectURL(blob);
                    setSrc(source)
					var pastedImage = new Image();
                    pastedImage.onload = function () {
                        if(props.autoresize == true){
                            setWidth(pastedImage.width);
                            setHeight(pastedImage.height);
                        }
                    };
                    pastedImage.src = source;
					is_image = true;
                    document.getElementById(props.imgId).losFiles = [blob]
				}
			}
			if(is_image == true){
				e.preventDefault();
			}
		}
    };
    return (
        <div id="previsualizador-imagen">
            <img style={{border:"1px solid grey"}} id={props.imgId} width={width} height={height} src={src}/>
            <ImagenInfo src={src} sizeParams={props.sizeParams} width={width} height={height}/>
        </div>
    )
}

export function previsualizarImagen(imgId:string, targetElementId:string, parametrosImagen:ParametrosImagen){
    ReactDOM.render(
        <PrevisualizadorImagen imgId= {imgId} width={300} height={300} autoresize={true} src={null} sizeParams={parametrosImagen}/>
        , document.getElementById(targetElementId)
    );
}
