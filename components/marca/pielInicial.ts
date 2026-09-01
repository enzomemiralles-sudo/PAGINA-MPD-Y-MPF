/**
 * Script que fija la marca antes del primer pintado.
 *
 * Va en el <head>, no en el cuerpo: el CSS bloquea el pintado, así que cuando
 * el navegador está por pintar este script ya corrió y el atributo está
 * puesto. Sin esto, entrar con sesión a cualquier pantalla mostraba un
 * fotograma con la piel de la portada antes de la del perfil.
 *
 * La marca sale de una cookie que se escribe al elegir perfil. Es sólo para
 * el primer pintado — la fuente de verdad sigue siendo la fila en profiles, y
 * <AplicarPiel> la corrige apenas responde el servidor.
 *
 * Las pantallas sin dueño —la portada, el ingreso, crear perfil— no leen la
 * cookie: la portada es dual porque las dos marcas conviven, y el ingreso es
 * neutro hasta que la persona elige.
 */
export const PIEL_INICIAL = `(function(){try{
var r=location.pathname;
var m='dual';
if(/^\\/(ingresar|crear-perfil|elegir-perfil|admin)(\\/|$)/.test(r)){m='neutro';}
else if(r!=='/'){
var c=document.cookie.match(/(?:^|; )marca=(nexo|na)/);
if(c)m=c[1];
}
document.documentElement.setAttribute('data-marca',m);
}catch(e){}})()`;
