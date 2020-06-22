import * as React from "react";
const {useState} = React;
import * as ReactDOM from "react-dom";

import * as likeAr from "like-ar";
import {compareForOrder} from "best-globals";

import {
    // alfabéticamente:
    AppBar,
    Button,
    Collapse,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemText,
    Slide,
    Snackbar,
    SvgIcon,
    SwipeableDrawer,
    Theme,
    Toolbar,
    Typography,
    Zoom,
    createStyles,
    fade,
    makeStyles,
    useMediaQuery,
    useScrollTrigger,
    useTheme
} from "@material-ui/core";

type Indicador = {
    indicador:string,
    abreviacion:string,
    denominacion:string,
    nombre_cuadro:string,
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
    uso_alc_lim:string,
    ultima_actualizacion:string,
    palabras:string[]
}

type Dimension = {
    dimension:string,
    abreviacion:string,
    denominacion:string,
    color:string,
    indicadores:Indicador[]
}

// https://material-ui.com/components/material-icons/
export const materialIoIconsSvgPath={
    Assignment: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
    Close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    Code: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    EmojiObjects: "M12 3c-.46 0-.93.04-1.4.14-2.76.53-4.96 2.76-5.48 5.52-.48 2.61.48 5.01 2.22 6.56.43.38.66.91.66 1.47V19c0 1.1.9 2 2 2h.28c.35.6.98 1 1.72 1s1.38-.4 1.72-1H14c1.1 0 2-.9 2-2v-2.31c0-.55.22-1.09.64-1.46C18.09 13.95 19 12.08 19 10c0-3.87-3.13-7-7-7zm2 16h-4v-1h4v1zm0-2h-4v-1h4v1zm-1.5-5.59V14h-1v-2.59L9.67 9.59l.71-.71L12 10.5l1.62-1.62.71.71-1.83 1.82z",
    ExpandLess: "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z",
    ExpandMore: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
    FirstPage: "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z",
    Info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
    Label: "M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z",
    LabelImportan: "M3.5 18.99l11 .01c.67 0 1.27-.33 1.63-.84L20.5 12l-4.37-6.16c-.36-.51-.96-.84-1.63-.84l-11 .01L8.34 12 3.5 18.99z",
    LastPage: "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z",
    LocalAtm: "M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm9-13H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z",
    KeyboardArrowLeft: "M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z",
    KeyboardArrowRight: "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z",
    KeyboardArrowUp: "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z",
    Menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    SearchIcon: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    Warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
}

const ICON = likeAr(materialIoIconsSvgPath).map(svgText=> (props:any) =>
    <SvgIcon {...props}><path d={svgText}/></SvgIcon>
).plain();

const InfoIcon = ICON.Info;
const KeyboardArrowUpIcon = ICON.KeyboardArrowUp;
const SearchIcon = ICON.SearchIcon;
const WarningIcon = ICON.Warning;

const useStylesSearchAppBar = makeStyles((theme: Theme) =>
    createStyles({
        // root: {
        //   flexGrow: 1,
        // },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        mas790: {
            '@media (max-width:839px)':{
                display:'none'
            }
        },
        menos790: {
            '@media (min-width:840px)':{
                display:'none'
            }
        },
        title: {
            flexGrow: 1,
            /*
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
            */
        },
        normalIcon:{
            display:'none',
            [theme.breakpoints.up('sm')]:{
                display:'inline',
            }
        },
        miniIcon:{
            [theme.breakpoints.up('sm')]:{
                display:'none',
            }
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
            '@media (min-width:840px)': {
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
            '@media (min-width:840px)': {
                width: 120,
                '&:focus': {
                    width: 200,
                },
            },
        },
    }),
);

function HideOnScroll(props: { active:boolean, children: JSX.Element },) {
    const { children } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    if(!props.active){
        return props.children;
    }
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const handleScroll = (id:string) => () => {
    // window.scrollTo(0,0)
    const anchor = document.getElementById(id);
    if (anchor) {
        // @ts-ignore   pizarron existe como id global
        var contenedor:HtmlDivElement=window.pizarron;
        window.scroll({behavior:'smooth', top:anchor.offsetTop-contenedor.offsetTop, left:0})
    }
};

function ListItemWithSubList(props:{ primary:string, secondary?:string, open:boolean, onToggle:(open:boolean)=>void, children:JSX.Element[] }){
    return <>
        <ListItem button onClick={()=>props.onToggle(!props.open)}>
            <ListItemText primary={props.primary} secondary={props.secondary} />
            {props.open ? <ICON.ExpandLess /> : <ICON.ExpandMore />}
        </ListItem>    
        <Collapse in={props.open} timeout="auto" unmountOnExit>
            <List>
                {props.children}
            </List>
        </Collapse>
    </>
}

const useStylesMenu = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);

const useStylesFicha = makeStyles(() =>
    createStyles({
        nombreCampo: {
            color: 'black'
        },
    }),
);

const SALTO_PRIMER_INDICADOR=-9393931;
const SALTO_ULTIMO_INDICADOR=-9393932;

type LogoDef={file:string, fileMini:string}

function SearchAppBar(props: { 
    dimensiones:Dimension[], 
    nombre_sistema:string, 
    logos:LogoDef[],
    search:string|null, 
    unlogged:boolean, 
    onSearch: (value: string) => void
}) {
    var search = props.search;
    var [menuAbierto, setMenuAbierto] = useState(false);
    var [irA, setIrA] = useState<string|null>(null);
    var [menuDimensiones, setMenuDimensiones] = useState(true);
    var [menuIndicadores, setMenuIndicadores] = useState(false);
    var logos = props.logos;
    React.useEffect(()=>{
        if(irA){
            handleScroll(irA)();
            setIrA(null)
        }
    },[irA])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        props.onSearch(value);
    };
    const classes = useStylesSearchAppBar();
    const classesMenu = useStylesMenu();
    var indicadoresOrdenados = ([] as Indicador[]).concat(...props.dimensiones.map(({indicadores}:Dimension) => indicadores));
    indicadoresOrdenados.sort(compareForOrder([{column:'denominacion' as 'denominacion', order:1 as 1}]))
    return (
        <>
            <HideOnScroll active={props.unlogged}>
                <AppBar position={props.unlogged?'fixed':'static'}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                            onClick={()=>setMenuAbierto(true)}
                        >
                            {""/*<MenuIcon />*/}
                            <img className="local-logo" src="./storage/local-logo.png" />
                        </IconButton>
                        <Typography className={classes.mas790+" "+classes.title} variant="h6" noWrap>
                            <span >{props.nombre_sistema}</span>
                            {logos.map(logoDef=><IconButton >
                                <img className="local-logo" src={`./storage/${logoDef.file}`} />
                            </IconButton>)}
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                value={search}
                                placeholder="Buscar..."
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={handleChange}
                            />
                        </div>
                        {logos.map(logoDef=><IconButton className={classes.menos790}>
                            <img className={"local-logo "+classes.normalIcon+" "+classes.menos790} src={`./storage/${logoDef.file}`} />
                            <img className={"local-logo "+classes.miniIcon} src={`./storage/${logoDef.fileMini}`} />
                        </IconButton>)}
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Toolbar id="tope" />
            <SwipeableDrawer
                open={menuAbierto}
                onClose={()=>setMenuAbierto(false)}
                onOpen={()=>setMenuAbierto(true)}
            >
                <div
                    x-className="{classes.list}"
                    role="presentation"
                >
                    <ListItemWithSubList primary="Dimensiones" open={menuDimensiones} onToggle={setMenuDimensiones}>
                        {props.dimensiones.map(({dimension, denominacion}:Dimension) => (
                            <ListItem className={classesMenu.nested} button key={dimension}>
                                <ListItemText primary={denominacion} onClick={()=>{
                                    setMenuAbierto(false);
                                    setIrA("dimension-"+dimension);
                                }}/>
                            </ListItem>
                        ))}
                    </ListItemWithSubList>
                    <Divider />
                    <ListItemWithSubList primary="Indicadores" secondary="en orden alfabético" open={menuIndicadores} onToggle={setMenuIndicadores}>
                        {indicadoresOrdenados.map(({denominacion}:Indicador) => (
                            <ListItem className={classesMenu.nested} button key={denominacion}>
                                <ListItemText primary={denominacion} onClick={()=>{
                                    setMenuAbierto(false);
                                    setIrA("indicador-"+denominacion);
                                }}/>
                            </ListItem>
                        ))}
                    </ListItemWithSubList>
                    <Divider />
                </div>
            </SwipeableDrawer>            
        </>
    );
}

const TituloIndicador = (props:{indicador:Indicador})=>(
    <div className="nombre-indicador">{props.indicador.abreviacion||props.indicador.denominacion||props.indicador.nombre_cuadro}</div>
)

const CampoFicha = (props:{valor:string, nombre:string}) =>{
    var classes = useStylesFicha();
    return <>{props.valor?
        <DialogContentText id="alert-dialog-description">
            <span className={classes.nombreCampo}>{props.nombre}: </span>
            <span className="ficha-valor">{props.valor}</span>
        </DialogContentText>
    :null}</>;
}

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

const DialogIndicador =  (props:{
    indicador:Indicador, 
    dimension:Dimension, 
    modelo_ficha:string, 
    open:boolean,
    isFirst:boolean,
    isLast:boolean,
    onClose:((event: {}) => void),
    onPrev:()=>void,
    onNext:()=>void,
    onFirst:()=>void,
    onLast:()=>void,
})=>{
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return <Dialog
        className="fila-indicador"
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={fullScreen}
        maxWidth="lg"
    >
        <DialogTitle id="alert-dialog-title">{props.dimension.denominacion||''}</DialogTitle>
        {!props.modelo_ficha?
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.indicador.nombre_cuadro||props.indicador.denominacion||''}
                </DialogContentText>
                <ImagenPreview indicador={props.indicador}/>
                <CampoFicha valor={props.indicador.fuente}   nombre="Fuente"/>
                <CampoFicha valor={props.indicador.um}       nombre="Unidad de medida"/>
                <CampoFicha valor={props.indicador.universo} nombre="Universo"/>
                <CampoFicha valor={props.indicador.def_con}  nombre="Definición conceptual"/>
                <CampoFicha valor={props.indicador.def_ope}  nombre="Definición operativa"/>
                <CampoFicha valor={props.indicador.cob}      nombre="Cobertura"/>
                <CampoFicha valor={props.indicador.desagregaciones} nombre="Desagregaciones"/>
                <CampoFicha valor={props.indicador.uso_alc_lim} nombre="Uso, alcances y limitaciones"/>
            </DialogContent>
        :
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.indicador.nombre_cuadro||props.indicador.denominacion||''}
                </DialogContentText>
                <ImagenPreview indicador={props.indicador}/>
                <CampoFicha valor={props.indicador.def_con}  nombre="Definición conceptual"/>
                <CampoFicha valor={props.indicador.def_ope}  nombre="Definición operativa"/>
                <CampoFicha valor={props.indicador.um}       nombre="Unidad de medida"/>
                <CampoFicha valor={props.indicador.universo} nombre="Universo"/>
                <CampoFicha valor={props.indicador.desagregaciones} nombre="Desagregaciones"/>
                <CampoFicha valor={props.indicador.fuente}          nombre="Fuente"/>
                <CampoFicha valor={props.indicador.uso_alc_lim}     nombre="Uso, alcances y limitaciones"/>
                <CampoFicha valor={props.indicador.ultima_actualizacion} nombre="Última actualización"/>
            </DialogContent>
        }
        <DialogActions>
            <Button onClick={props.onFirst} color="primary" disabled={props.isFirst}>
                <ICON.FirstPage fontSize="large"/>
            </Button>
            <Button onClick={props.onPrev} color="primary" disabled={props.isFirst}>
                <ICON.KeyboardArrowLeft fontSize="large"/>
            </Button>
            <Button onClick={props.onNext} color="primary" disabled={props.isLast}>
                <ICON.KeyboardArrowRight fontSize="large"/>
            </Button>
            <Button onClick={props.onLast} color="primary" disabled={props.isLast}>
                <ICON.LastPage fontSize="large"/>
            </Button>
            <Button href={"./download/file?indicador=" + props.indicador.indicador +"&dimension="+props.indicador.dimension} download={props.indicador.indicador+".xlsx"} color="primary" variant="contained">Descargar</Button>
            <Button onClick={props.onClose} color="primary" autoFocus>
                Cerrar
            </Button>
        </DialogActions>
    </Dialog>
};

const SeccionIndicador = (props:{
    abierto:number|false,
    indicador:Indicador, 
    dimension:Dimension, 
    modelo_ficha:string,
    isFirst:boolean,
    isLast:boolean,
    cambiarAbierto:(cambio:number|boolean)=>void
})=>{
    const [open, setOpen] = [props.abierto!==false, props.cambiarAbierto];
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return <>
        <div className="caja-indicador-contenedor" id={"indicador-"+props.indicador.denominacion}>
            <div className="caja-indicador" title={props.indicador.denominacion}
                style={{backgroundImage:props.indicador.preview?`url("./storage/${props.indicador.dimension}/${props.indicador.preview}")`:''}}
                onClick={handleClickOpen}
            >
                <TituloIndicador indicador={props.indicador}/>
            </div>
        </div>
        <DialogIndicador 
            open={open} 
            dimension={props.dimension}
            indicador={props.indicador}
            modelo_ficha={props.modelo_ficha}
            onClose={handleClose}
            isFirst={props.isFirst}
            isLast={props.isLast}
            onPrev={()=>props.abierto!==false && props.cambiarAbierto(props.abierto-1)}
            onNext={()=>props.abierto!==false && props.cambiarAbierto(props.abierto+1)}
            onFirst={()=>props.abierto!==false && props.cambiarAbierto(SALTO_PRIMER_INDICADOR)}
            onLast={()=>props.abierto!==false && props.cambiarAbierto(SALTO_ULTIMO_INDICADOR)}
        />
    </>;
}

const TituloDimension = (props:{dimension:Dimension, color:string, mostrar_codigo_dimension:boolean})=>(
    <div className="titulo-dimension-contenedor">
        <div className="titulo-dimension">
            {props.mostrar_codigo_dimension?
            <div className="bullet-dimension" style={{
                backgroundColor:'white',
                color:props.color
            }}>{props.dimension.dimension}</div>
            :null}
            <div className="nombre-dimension" >{props.dimension.abreviacion||props.dimension.denominacion}</div>
        </div>
    </div>
)

const SeccionDimension = (props:{
    dimension:Dimension, 
    abierto:number|boolean,
    mostrar_codigo_dimension:boolean, 
    modelo_ficha:string,
    isFirst:boolean,
    isLast:boolean,
    cambiarAbierto:(cambio:number|false)=>void
})=>{
    return <>
        <div className="caja-dimension" id={"dimension-"+props.dimension.dimension} id-dimension={props.dimension.dimension}  
            mis-filas-en-2={(Math.floor((props.dimension.indicadores.length+2-1)/2)*2+1)}
            mis-filas-en-3={(Math.floor((props.dimension.indicadores.length+3-1)/3)*2+1)}
            style={{
                backgroundColor:props.dimension.color,
            }}
        >
            <TituloDimension dimension={props.dimension} color={props.dimension.color} mostrar_codigo_dimension={props.mostrar_codigo_dimension}/>
            <div className="caja-int-dimension">
                {props.dimension.indicadores.map( (indicador,i) =>
                    <SeccionIndicador 
                        abierto={i===props.abierto && props.abierto}
                        indicador={indicador} 
                        dimension={props.dimension} 
                        modelo_ficha={props.modelo_ficha}
                        isFirst={props.isFirst && i===0}
                        isLast={props.isLast && i===props.dimension.indicadores.length-1}
                        cambiarAbierto={(cambio:number|boolean)=>props.cambiarAbierto(cambio===true?i:cambio)}
                        key={indicador.indicador}
                    />
                )}
            </div>
        </div>
    </>
}

const ListaIndicadores = (props:{dimensiones:Dimension[], mostrar_codigo_dimension:boolean, modelo_ficha:string}) => {
    const [abierto, setAbierto] = useState<{dimensionIdx:number, indicadorIdx:number}|false>(false);
    return <div id="pizarron">
        {props.dimensiones.map( (dimension,i) =>
            <SeccionDimension 
                abierto={abierto && abierto.dimensionIdx == i && abierto.indicadorIdx}
                cambiarAbierto={(nuevo:number|false)=>{
                    if(nuevo===false || nuevo==-1 && i==0 || nuevo>=dimension.indicadores.length && i >= props.dimensiones.length){
                        setAbierto(false);
                    }else if(nuevo==SALTO_PRIMER_INDICADOR){
                        setAbierto({dimensionIdx:0, indicadorIdx:0});
                    }else if(nuevo==SALTO_ULTIMO_INDICADOR){
                        const ultimaDimension=props.dimensiones.length-1;
                        setAbierto({dimensionIdx:ultimaDimension, indicadorIdx:props.dimensiones[ultimaDimension].indicadores.length-1});
                    }else if(nuevo==-1){
                        setAbierto({dimensionIdx:i-1, indicadorIdx:props.dimensiones[i-1].indicadores.length-1});
                    }else if(nuevo>=dimension.indicadores.length){
                        setAbierto({dimensionIdx:i+1, indicadorIdx:0});
                    }else{
                        setAbierto({dimensionIdx:i, indicadorIdx:nuevo});
                    }
                }}
                dimension={dimension} 
                key={dimension.dimension} 
                isFirst={i==0}
                isLast={i==props.dimensiones.length-1}
                mostrar_codigo_dimension={props.mostrar_codigo_dimension} 
                modelo_ficha={props.modelo_ficha}
            />
        )}
    </div>
}

const useStylesScrollTop = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
);

function ScrollTop(props: any) {
    const { children } = props;
    const classes = useStylesScrollTop();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });
    return (
        <Zoom in={trigger}>
            <div onClick={handleScroll('tope')} role="presentation" className={classes.root}>
                {children}
            </div>
        </Zoom>
    );
}

function AppMiniRepo(props:{
    dimensiones:Dimension[], 
    unlogged:boolean,
    nombre_sistema:string, 
    logos:LogoDef[],
    mostrar_codigo_dimension:boolean,
    modelo_ficha:string
}){
    const [search, setSearch] = useState<string|null>(null);
    const searchChange = setSearch;
    const filteredResult = props.dimensiones.map(dimension=>
        !search?dimension:{...dimension, indicadores:dimension.indicadores.filter(indicador=>
            search.split(' ').map(p=>p.toLocaleLowerCase()).every(palabraBuscada=>
                indicador.palabras.map(p=>p.toLocaleLowerCase()).filter(palabra=>palabra.includes(palabraBuscada)).length
            )
        )}
    ).filter(dimension=>
        dimension.indicadores.length
    );
    var resultCount=filteredResult.reduce((sum,dimension)=>sum+dimension.indicadores.length,0);
    return <React.StrictMode>
        <CssBaseline />
        <div className="matriz-comparacion">
            <SearchAppBar 
                dimensiones={props.dimensiones} 
                nombre_sistema={props.nombre_sistema} 
                logos={props.logos}
                search={search} 
                onSearch={searchChange} 
                unlogged={props.unlogged}
            />
            <ListaIndicadores dimensiones={filteredResult} mostrar_codigo_dimension={props.mostrar_codigo_dimension} modelo_ficha={props.modelo_ficha}/>
            {!resultCount?
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        open={!resultCount}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="client-snackbar">
                            <WarningIcon/> 
                            <span id="message-id">No hay datos que coincidan con la búsqueda</span>
                        </span>}
                        action={[
                            <Button key="undo" color="secondary" size="small" onClick={()=>setSearch('')}>
                                LIMPIAR
                            </Button>,
                        ]}
                    />                
            :null}
            {search=="#"?
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={!resultCount}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="client-snackbar">
                        <InfoIcon/> 
                        <span id="message-id">{['innerWidth','outerWidth','innerHeight','outerHeight'].map(attr=>
                            // @ts-ignore:  Este es un mensaje de debug
                            <span> <b> {attr}: </b> {window[attr]} </span> 
                        )}</span>
                    </span>}
                />                
            :null}
        </div>
        <ScrollTop>
            <Fab color="secondary" size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
            </Fab>
        </ScrollTop>
    </React.StrictMode>
}

export function mostrar(result:{
    dimensiones:Dimension[],
    nombre_sistema:string,
    logos:LogoDef[],
    mostrar_codigo_dimension:boolean,
    modelo_ficha:string
}, unlogged:boolean){
    ReactDOM.render(
        <AppMiniRepo 
            dimensiones={result.dimensiones} 
            unlogged={unlogged}
            nombre_sistema={result.nombre_sistema} 
            logos={result.logos}
            mostrar_codigo_dimension={result.mostrar_codigo_dimension}
             modelo_ficha={result.modelo_ficha}
        />
        , document.getElementById("main_layout")
    );
}
