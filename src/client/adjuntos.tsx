import * as React from "react";
import * as ReactDOM from "react-dom";

const PrevisualizadorImagen = function(props:{imgId:string, width: number, height:number, autoresize:boolean, src:string|null}){
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
            <div id="image-info">
                <div style={{color:'#dc3545'}}>{src?'':'Pegar la imágen con Ctrl-V'}</div>
                <span>alto: {width}px</span> - <span>ancho: {height}px</span>
            </div>
        </div>
    )
}

export function previsualizarImagen(imgId:string, targetElementId:string){
    ReactDOM.render(
        <PrevisualizadorImagen imgId= {imgId} width={300} height={300} autoresize={true} src={null}/>
        , document.getElementById(targetElementId)
    );
}
