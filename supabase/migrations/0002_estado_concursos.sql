-- Estado real de los concursos a agosto de 2026.
-- La landing se acomoda sola a partir de acá: cuando el MPD pase a
-- fecha_confirmada, la franja y el cierre cambian sin tocar código.

insert into concursos (organismo, cargo, anio, estado, url_oficial) values
  ('mpd', 'Técnico administrativo', 2026, 'sin_convocatoria',
   'https://www.mpd.gov.ar/index.php/secretaria-de-concursos-n/inscripciones-vigentes'),
  ('mpf', 'Técnico administrativo', 2026, 'finalizado',
   'https://www.mpf.gob.ar/Ingresodemocratico/')
on conflict (organismo, cargo, anio) do nothing;
