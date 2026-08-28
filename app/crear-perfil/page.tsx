import { redirect } from "next/navigation";

/**
 * Puente hasta la tanda 2.
 *
 * M-08 manda «Empezar gratis» a /crear-perfil, pero la pantalla que va a vivir
 * acá es de la tanda siguiente. Sin esta ruta el botón principal de la portada
 * daría 404, así que por ahora deriva al ingreso, que es donde hoy empieza el
 * recorrido de verdad.
 *
 * Cuando F-01 y P-01..P-06 definan la pantalla, este archivo se reemplaza por
 * ella y no hay que tocar ningún enlace.
 */
export default function CrearPerfil() {
  redirect("/ingresar");
}
