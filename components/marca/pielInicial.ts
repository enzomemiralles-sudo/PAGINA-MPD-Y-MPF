/**
 * Script que fija la piel antes del primer pintado.
 *
 * Va en el <head>, no en el cuerpo: el CSS bloquea el pintado, así que cuando
 * el navegador está por pintar este script ya corrió y los atributos están
 * puestos. Antes se hacía desde el layout de cada ruta, dentro del <body>, y
 * el servidor mandaba data-superficie="oscura" para todas: el ingreso salía
 * oscuro y recién después saltaba a claro.
 *
 * La marca de /app y /mi-perfil sale de una cookie que se escribe al elegir
 * perfil. Es sólo para el primer pintado — la fuente de verdad sigue siendo
 * la fila en profiles, y <AplicarPiel> la corrige apenas responde el servidor.
 */
export const PIEL_INICIAL = `(function(){try{
var r=location.pathname;
var clara=/^\\/(ingresar|crear-perfil|elegir-perfil|app|mi-perfil|simulador|asistente|revisar)(\\/|$)/.test(r);
var d=document.documentElement;
d.setAttribute('data-superficie',clara?'clara':'oscura');
var m=clara?'neutro':'dual';
if(/^\\/(app|mi-perfil|simulador|asistente|revisar)(\\/|$)/.test(r)){
var c=document.cookie.match(/(?:^|; )marca=(nexo|na)/);
if(c)m=c[1];
}
d.setAttribute('data-marca',m);
}catch(e){}})()`;
