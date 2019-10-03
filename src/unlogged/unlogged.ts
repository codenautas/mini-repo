"use strict";

import {mostrar} from "./matriz";

window.addEventListener('load', async function(){
    var layout = document.getElementById('total-layout')!;
    layout.innerHTML+='<div>...</div>';
    // @ts-ignore ready existe!
    await myOwn.ready;
    layout.innerHTML+='<div>_</div>';
    var result = await myOwn.ajax.matriz_traer({});
    mostrar(result);
})