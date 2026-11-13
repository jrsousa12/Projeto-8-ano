/* ---------- instalar na tela inicial e tela cheia automática ---------- */
const isWeb=/^https?:$/.test(location.protocol);
const standalone=()=>{try{return matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches||navigator.standalone===true;}catch(e){return false;}};
let dip=null,autoFs=LSg("an8fs")!=="no",instHid=false;
if(isWeb){try{const l=document.createElement("link");l.rel="manifest";l.href="manifest.webmanifest";document.head.appendChild(l);
 if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});}catch(e){}}
function instHelp(){const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 if(dip)return "Toque em Instalar para pôr o app na tela inicial. Ele abre em tela cheia.";
 return (ios?"No iPhone/iPad: toque em Compartilhar e depois em “Adicionar à Tela de Início”.":"No Chrome do celular: toque em ⋮ e depois em “Instalar app” ou “Adicionar à tela inicial”.")+(isWeb?"":" Para abrir como app em tela cheia, publique o pacote em um endereço https (veja o LEIA-ME).");}
function hideInst(){const b=$("#inst");if(b)b.remove();}
function showInst(force){if(standalone()||instHid||(!force&&LSg("an8inst")==="no"))return;hideInst();
 const b=document.createElement("div");b.id="inst";
 b.innerHTML=`<div class="it">📲 <b>Instalar na tela inicial</b><span>${instHelp()}</span></div><div class="ib">${dip?`<button class="btn pri" id="instOk">Instalar</button>`:""}<button class="btn" id="instNo">Agora não</button><button class="btn" id="instNever">Não mostrar mais</button></div>`;
 document.body.appendChild(b);setTimeout(()=>{if(b.isConnected){instHid=true;b.remove();}},15000);
 if($("#instOk"))$("#instOk").onclick=async()=>{try{dip.prompt();await dip.userChoice;}catch(e){}dip=null;hideInst();};
 $("#instNo").onclick=()=>{instHid=true;hideInst();};
 $("#instNever").onclick=()=>{LSs("an8inst","no");hideInst();};}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e;showInst();});
addEventListener("appinstalled",()=>{dip=null;hideInst();});
$("#ai").onclick=()=>{$("#opm").classList.remove("show");LSs("an8inst","");instHid=false;if(dip)showInst(true);else showInst(true);};
$("#af").onclick=function(){autoFs=!autoFs;LSs("an8fs",autoFs?"sim":"no");this.setAttribute("aria-pressed",autoFs);this.textContent="⛶ Tela cheia automática: "+(autoFs?"sim":"não");};
$("#af").textContent="⛶ Tela cheia automática: "+(autoFs?"sim":"não");$("#af").setAttribute("aria-pressed",autoFs);
document.addEventListener("pointerdown",ev=>{if(!ev.isTrusted||!autoFs||document.fullscreenElement||standalone())return;
 try{const r=document.documentElement.requestFullscreen();if(r&&r.catch)r.catch(()=>{});}catch(e){}},{once:true});
setTimeout(()=>showInst(),1500);
