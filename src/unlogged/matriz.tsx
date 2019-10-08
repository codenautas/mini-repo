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

import { AppBar, Toolbar, IconButton, Typography, InputBase, SvgIcon, makeStyles } from '@material-ui/core';
// import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
// const { createStyles, fade, Theme } = styled;


// https://material-ui.com/components/material-icons/
export const materialIoIconsSvgPath:{[k:string]:string}={
    Assignment: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
    Code: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    EmojiObjects: "M12 3c-.46 0-.93.04-1.4.14-2.76.53-4.96 2.76-5.48 5.52-.48 2.61.48 5.01 2.22 6.56.43.38.66.91.66 1.47V19c0 1.1.9 2 2 2h.28c.35.6.98 1 1.72 1s1.38-.4 1.72-1H14c1.1 0 2-.9 2-2v-2.31c0-.55.22-1.09.64-1.46C18.09 13.95 19 12.08 19 10c0-3.87-3.13-7-7-7zm2 16h-4v-1h4v1zm0-2h-4v-1h4v1zm-1.5-5.59V14h-1v-2.59L9.67 9.59l.71-.71L12 10.5l1.62-1.62.71.71-1.83 1.82z",
    Label:"M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z",
    LocalAtm: "M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm9-13H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z",
    Menu:"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    SearchIcon:""
}

// FROM: .../node_modules/@material-ui/core/umd/material-ui.development.js
function fade(color, value) {
    return color
}

const MenuIcon = () =>
    <SvgIcon>
        <path d={materialIoIconsSvgPath.Menu} />
    </SvgIcon>

const SearchIcon = () =>
    <SvgIcon>
        <path d={materialIoIconsSvgPath.SearchIcon} />
    </SvgIcon>


const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
  }),
);

export default function SearchAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Material-UI
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const TituloIndicador = (props:{indicador:Indicador})=>(
    <div className="nombre-indicador">{props.indicador.abreviacion||props.indicador.denominacion}</div>
)

const CampoFicha = (props:{valor:string, nombre:string}) =>
    <>{props.valor?
        <DialogContentText id="alert-dialog-description">
            <span className="ficha-nombre">{props.nombre}: </span>
            <span className="ficha-valor">{props.valor}</span>
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

const SeccionIndicador = (props:{indicador:Indicador, dimension:Dimension})=>{
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
        >
            <DialogTitle id="alert-dialog-title">{props.dimension.denominacion||''}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.indicador.abreviacion||''}
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                    {props.indicador.denominacion||''}
                </DialogContentText>
                <ImagenPreview indicador={props.indicador}/>
                <CampoFicha valor={props.indicador.fuente}   nombre="Fuente"/>
                <CampoFicha valor={props.indicador.um}       nombre="Unidad de medida"/>
                <CampoFicha valor={props.indicador.universo} nombre="Universo"/>
                <CampoFicha valor={props.indicador.def_con}  nombre="Definición conceptual"/>
                <CampoFicha valor={props.indicador.def_ope}  nombre="Definición operativa"/>
                <CampoFicha valor={props.indicador.cob}      nombre="Cobertura"/>
                <CampoFicha valor={props.indicador.desagregaciones} nombre="desagregaciones"/>
                <CampoFicha valor={props.indicador.uso_alc_lim} nombre="uso, alcances y limitaciones"/>
            </DialogContent>
            <DialogActions>
                <Button href={"./download/file?name=" + props.indicador.archivo +"&dimension="+props.indicador.dimension} download={props.indicador.archivo} color="primary">Descargar</Button>
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
                    <SeccionIndicador indicador={indicador} dimension={props.dimension} key={indicador.indicador}/>
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
                    <SeccionIndicador indicador={indicador} dimension={props.dimension} key={indicador.indicador}/>
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
