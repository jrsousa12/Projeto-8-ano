/* Funções usadas pelo app e pelo editor de questões. */
"use strict";
/* resumo (hash) de um texto: assina o progresso salvo e identifica as perguntas */
function hsh(str){let h1=0x9e3779b9,h2=0x85ebca6b;for(let i=0,ch;i<str.length;i++){ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677);}
 h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(16);}
/* identificador de uma pergunta: texto + alternativas (há perguntas com o mesmo texto e alternativas diferentes) */
function idPerg(q,o){return "q"+hsh(String(q).trim()+"|"+(o||[]).map(x=>String(x).trim()).sort().join("|"));}
