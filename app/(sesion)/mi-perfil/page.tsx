import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { traerPerfil } from "@/lib/perfil";
import { Tarjeta } from "@/components/marca/Tarjeta";
import { FormularioMiPerfil } from "@/components/app/FormularioMiPerfil";
import { textosDe } from "@/lib/marca/marcas";
import { miPerfil as t } from "@/content/onboarding";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";

export const metadata: Metadata = { title: "Mi perfil — Nexo Derecho × Nueva Abogacía" };
export const dynamic = "force-dynamic";

const fechaLarga = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function MiPerfil() {
  const sb = await crearClienteServidor();
  if (!sb) redirect("/ingresar");

  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/ingresar");

  const perfil = await traerPerfil();
  if (!perfil?.marca || !perfil.tipo_perfil) redirect("/elegir-perfil");

  const textos = textosDe(perfil.marca);

  // Los valores llegan como texto: es lo que consumen los inputs.
  const iniciales: Record<string, string> = {
    anio_egreso: perfil.anio_egreso?.toString() ?? "",
    jurisdiccion: perfil.jurisdiccion ?? "",
    matriculado: perfil.matriculado === null ? "" : perfil.matriculado ? "si" : "no",
    area_ejercicio: perfil.area_ejercicio ?? "",
    anio_ingreso: perfil.anio_ingreso?.toString() ?? "",
    como_conocio: perfil.como_conocio ?? "",
    trabaja_juridico: perfil.trabaja_juridico ?? "",
    dni: perfil.dni ?? "",
    telefono: perfil.telefono ?? "",
  };

  return (
    <>

      <main className="env app-cuerpo" style={{ maxWidth: "40rem" }}>
      <VolverAlPerfil />
        <h1>{t.titulo}</h1>
        <p style={{ marginTop: "0.8rem", color: "var(--texto-tenue)" }}>{t.bajada}</p>

        <Tarjeta className="tarjeta" style={{ marginTop: "1.8rem" }}>
          <h2 className="titulo-bloque">{t.cuenta}</h2>
          <dl className="datos-cuenta">
            <dt>{t.correo}</dt>
            <dd>{data.user.email}</dd>
            <dt>{t.perfilElegido}</dt>
            <dd>{t.tipos[perfil.tipo_perfil]}</dd>
            <dt>{t.aceptacion}</dt>
            <dd>
              {perfil.fecha_aceptacion
                ? t.aceptadaEl(fechaLarga.format(new Date(perfil.fecha_aceptacion)))
                : t.sinAceptar}
            </dd>
          </dl>

          <form action="/auth/salir" method="post" style={{ marginTop: "1.4rem" }}>
            <button className="btn btn-s" type="submit">
              {t.cerrarSesion}
            </button>
          </form>
        </Tarjeta>

        <Tarjeta className="tarjeta" style={{ marginTop: "1rem" }}>
          <h2 className="titulo-bloque">{t.tipos[perfil.tipo_perfil]}</h2>
          <FormularioMiPerfil
            tipo={perfil.tipo_perfil}
            org={textos.corto}
            legal={textos.legalGuarda}
            iniciales={iniciales}
            yaAcepto={!!perfil.fecha_aceptacion}
          />
        </Tarjeta>
      </main>
    </>
  );
}
