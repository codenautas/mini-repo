import * as React from "react";
import * as ReactDOM from "react-dom";

type Indicador = {
    indicador:string,
    abreviacion:string,
    denominacion:string,
    dimension:string,
    archivo:string,
    preview:string,
    fte:string,
    um:string
}

type Dimension = {
    dimension:string,
    denominacion:string,
    color:string,
    indicadores:Indicador[]
}

const TituloIndicador = (props:{indicador:Indicador})=>(
    <div className="nombre-indicador">{props.indicador.abreviacion||props.indicador.denominacion}</div>
)

const SeccionIndicador = (props:{indicador:Indicador})=>(
    <div className="caja-indicador" title={props.indicador.denominacion}
        style={{backgroundImage:props.indicador.preview?`url("./storage/${props.indicador.dimension}/${props.indicador.preview}")`:''}}
    >
        <TituloIndicador indicador={props.indicador}/>
    </div>
)

const TituloDimension = (props:{dimension:Dimension})=>(
    <div className="titulo-dimension">
        <span className="nombre-dimension" >{props.dimension.denominacion}</span>
    </div>
)

const SeccionDimension = (props:{dimension:Dimension})=>(
    <div className="caja-dimension" id-dimension={props.dimension.dimension} 
        style={{
            backgroundColor:props.dimension.color,
            gridRow:'span '+(Math.floor((props.dimension.indicadores.length+2)/3)*2+1)
        }} 
    >
        <TituloDimension dimension={props.dimension} />
        <div className="caja-int-dimension">
            {props.dimension.indicadores.map( indicador =>
                <SeccionIndicador indicador={indicador} key={indicador.indicador}/>
            )}
        </div>
    </div>
)

const ListaIndicadores = (props:{dimensiones:Dimension[]}) => (
    <div id="pizarron">
        {props.dimensiones.map( dimension =>
            <SeccionDimension dimension={dimension} key={dimension.dimension} />
        )}
    </div>
)

export function mostrar(result:{dimensiones:Dimension[]}){
    ReactDOM.render(
        <div className="matriz-comparacion">
            <ListaIndicadores dimensiones={result.dimensiones}/>
        </div>
        , document.getElementById("main_layout")
    );
}
