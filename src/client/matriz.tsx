import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { useMediaQuery, useTheme} from "@material-ui/core";

type Indicador = {
    indicador:string,
    abreviacion:string,
    denominacion:string,
    dimension:string,
    archivo:string,
    preview:string,
    fuente:string,
    um:string
    universo:string
    def_con:string
    def_ope:string
    cob:string
    desagregaciones:string
    uso_alc_lim:string
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

const CampoFicha = (props:{valor:string, nombre:string}) =>
    <>{props.valor?
        <DialogContentText id="alert-dialog-description">
            <span className="ficha-nombre">{props.nombre}: </span>
            <b className="ficha-valor">{props.valor}</b>
        </DialogContentText>
    :null}</>;

const ImagenPreview = (props:{indicador:Indicador}) => {
    const [fullWidth, setFullWidth] = React.useState(false);
    return <>{props.indicador.preview?
        <img 
            className="img-preview" 
            full-width={fullWidth?"full":"normal"} 
            src={`./storage/${props.indicador.dimension}/${props.indicador.preview}`}
            onClick={()=>setFullWidth(!fullWidth)}
        />
    :null}</>;
}

const SeccionIndicador = (props:{indicador:Indicador})=>{
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return <>
        <div className="caja-indicador-contenedor">
            <div className="caja-indicador" title={props.indicador.denominacion}
                style={{backgroundImage:props.indicador.preview?`url("./storage/${props.indicador.dimension}/${props.indicador.preview}")`:''}}
                onClick={handleClickOpen}
            >
                <TituloIndicador indicador={props.indicador}/>
            </div>
        </div>
        <Dialog
          className="fila-indicador"
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen={fullScreen}
          maxWidth="lg"
          fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">{props.indicador.dimension||''}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.indicador.abreviacion||''}
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                    {props.indicador.denominacion||''}
                </DialogContentText>
                <ImagenPreview indicador={props.indicador}/>
                <CampoFicha valor={props.indicador.fuente}   nombre="fuente"/>
                <CampoFicha valor={props.indicador.um}       nombre="unidad de medida"/>
                <CampoFicha valor={props.indicador.universo} nombre="universo"/>
                <CampoFicha valor={props.indicador.def_con}  nombre="definición conceptual"/>
                <CampoFicha valor={props.indicador.def_ope}  nombre="definición operativa"/>
                <CampoFicha valor={props.indicador.cob}      nombre="cobertura"/>
                <CampoFicha valor={props.indicador.desagregaciones} nombre="desagregaciones"/>
                <CampoFicha valor={props.indicador.uso_alc_lim} nombre="uso, alcances y limitaciones"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Descargar
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    </>;
}

const TituloDimension = (props:{dimension:Dimension})=>(
    <div className="titulo-dimension-contenedor">
        <div className="titulo-dimension">
            <span className="nombre-dimension" >{props.dimension.denominacion}</span>
        </div>
    </div>
)

const SeccionDimension = (props:{dimension:Dimension})=>(
    <>
        <div className="caja-dimension" id-dimension={props.dimension.dimension} mis-columnas="2"
            style={{
                backgroundColor:props.dimension.color,
                gridRow:'span '+(Math.floor((props.dimension.indicadores.length+2-1)/2)*2+1)
            }} 
        >
            <TituloDimension dimension={props.dimension} />
            <div className="caja-int-dimension">
                {props.dimension.indicadores.map( indicador =>
                    <SeccionIndicador indicador={indicador} key={indicador.indicador}/>
                )}
            </div>
        </div>
        <div className="caja-dimension" id-dimension={props.dimension.dimension} mis-columnas="3"
            style={{
                backgroundColor:props.dimension.color,
                gridRow:'span '+(Math.floor((props.dimension.indicadores.length+3-1)/3)*2+1)
            }} 
        >
            <TituloDimension dimension={props.dimension} />
            <div className="caja-int-dimension">
                {props.dimension.indicadores.map( indicador =>
                    <SeccionIndicador indicador={indicador} key={indicador.indicador}/>
                )}
            </div>
        </div>
    </>
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
