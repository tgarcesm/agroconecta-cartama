/*
-- RESET BEFORE PITCH (run in Supabase SQL Editor)
-- UPDATE subastas SET fecha_cierre = now() + interval '4 hours', mejor_oferta = 8200000, mejor_ofertante = 'Frigorífico El Rebaño', estado = 'activa' WHERE descripcion LIKE '%novillos cebados%';
-- UPDATE subastas SET fecha_cierre = now() + interval '11 hours', mejor_oferta = 5900000, mejor_ofertante = 'Ganadería Los Pinos', estado = 'activa' WHERE descripcion LIKE '%novillas%';
-- UPDATE subastas SET estado = 'pendiente_verificacion', mejor_oferta = null, mejor_ofertante = null WHERE descripcion LIKE '%machos gordos%';
-- DELETE FROM pujas;
-- DELETE FROM mensajes;
*/

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
