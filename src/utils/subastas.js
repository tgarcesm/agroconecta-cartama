/** Normaliza columnas de subastas con fallbacks seguros para la UI. */

export function getLoteId(subasta) {
  if (!subasta) return '—'
  if (subasta.lote) return subasta.lote
  if (subasta.id) return `AC-${String(subasta.id).slice(0, 8)}`
  return '—'
}

export function getMunicipio(subasta) {
  if (!subasta) return '—'
  return subasta.municipio ?? subasta.ganaderos?.municipio ?? '—'
}

export function getCantidad(subasta) {
  if (!subasta) return null
  return subasta.cantidad ?? subasta.cantidad_animales ?? null
}

export function getDescripcion(subasta) {
  if (!subasta) return '—'
  return subasta.descripcion ?? subasta.lote ?? '—'
}

export function getGanaderoNombre(subasta) {
  if (!subasta) return '—'
  return subasta.ganaderoNombre ?? subasta.ganaderos?.nombre ?? '—'
}

export function normalizeSubasta(raw) {
  if (!raw) return null
  return {
    ...raw,
    lote: getLoteId(raw),
    municipio: getMunicipio(raw),
    cantidad: getCantidad(raw),
    descripcion: getDescripcion(raw),
    ganaderoNombre: getGanaderoNombre(raw),
  }
}

export function normalizeSubastas(list) {
  return (list ?? []).map(normalizeSubasta).filter(Boolean)
}

export const FALLBACK_SUBASTAS = [
  {
    id: '00000000-0000-0000-0000-000000000047',
    lote: 'AC-2024-047',
    descripcion: '12 novillos cebados · Brahman x Angus',
    cantidad: 12,
    raza: 'Brahman x Angus',
    municipio: 'Támesis',
    peso_estimado: 420,
    precio_base: 7800000,
    mejor_oferta: 8200000,
    mejor_ofertante: 'Frigorífico El Rebaño',
    estado: 'activa',
    fecha_cierre: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    ganaderos: { nombre: 'Don Hernando Ríos', municipio: 'Támesis' },
  },
  {
    id: '00000000-0000-0000-0000-000000000048',
    lote: 'AC-2024-048',
    descripcion: '8 novillas en ceba · Angus',
    cantidad: 8,
    raza: 'Angus',
    municipio: 'Valparaíso',
    peso_estimado: 380,
    precio_base: 5500000,
    mejor_oferta: 5900000,
    mejor_ofertante: 'Ganadería Los Pinos',
    estado: 'activa',
    fecha_cierre: new Date(Date.now() + 11 * 60 * 60 * 1000).toISOString(),
    ganaderos: { nombre: 'Finca El Roble', municipio: 'Valparaíso' },
  },
]
