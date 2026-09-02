import { redirect } from "next/navigation";

/**
 * La dirección vieja de la guía.
 *
 * La guía se reescribió entera en /guia-inscripcion, con una pantalla previa
 * para elegir organismo. Esta ruta queda como redirección y no se borra: hay
 * enlaces sueltos —el menú del perfil de antes, algún mensaje ya mandado— que
 * de otro modo darían 404.
 */
export default function Inscripcion() {
  redirect("/guia-inscripcion");
}
