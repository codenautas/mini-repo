import * as React from "react";
import * as ReactDOM from "react-dom";

type Indicador = {
    indicador:string,
    denominacion:string,
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
    <td className="nombre-indicador">{props.indicador.denominacion}</td>
)

const SeccionIndicador = (props:{indicador:Indicador})=>(
    <tr className="titulo-indicador">
        <TituloIndicador indicador={props.indicador}/>
    </tr>
)

const TituloDimension = (props:{dimension:Dimension})=>(
    <tr className="titulo-dimension">
        <td className="nombre-dimension"    style={{color:props.dimension.color}}>{props.dimension.denominacion}</td>
    </tr>
)

const SeccionDimension = (props:{dimension:Dimension})=>(
    <>
        <TituloDimension dimension={props.dimension} />
        {props.dimension.indicadores.map( indicador =>
            <SeccionIndicador indicador={indicador}/>
        )}
    </>
)

const ListaIndicadores = (props:{dimensiones:Dimension[]}) => (
    <table className="la-lista">
        <tbody>
        {props.dimensiones.map( dimension =>
            <SeccionDimension dimension={dimension}/>
        )}
        </tbody>
    </table>
)

export function mostrar(result:{dimensiones:Dimension[]}){
    ReactDOM.render(
        <div className="matriz-comparacion">
            <ListaIndicadores dimensiones={result.dimensiones}/>
        </div>
        , document.getElementById("main_layout")
    );
}
