-- ============================================================
-- 0008 — La piel neutra para quien no es de ninguna de las dos.
--
-- El perfil «otro» venía guardando la marca de Nueva Abogacía, así que
-- alguien que dijo explícitamente que no es ni estudiante ni abogado/a
-- terminaba con los colores de una agrupación a la que no pertenece.
--
-- Ahora hay un tercer valor. No es una organización —de ahí el nombre del
-- tipo, que quedó de antes— sino la ausencia de una: la piel neutra.
--
-- Se puede correr más de una vez sin romper.
-- ============================================================

alter type perfil_organizacion add value if not exists 'neutro';

comment on column profiles.marca is
  'La piel del sitio para esta persona: nexo, na, o neutro cuando no es de ninguna de las dos. Se deriva de tipo_perfil al elegir, pero se guarda aparte para poder cambiarla sin tocar el perfil.';
