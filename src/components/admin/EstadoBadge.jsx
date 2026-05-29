const ESTADO_STYLES = {
  activa: 'bg-green-100 text-green-800',
  pendiente_verificacion: 'bg-yellow-100 text-yellow-800',
  cerrada: 'bg-gray-100 text-gray-600',
  activo: 'bg-green-100 text-green-800',
  pendiente: 'bg-yellow-100 text-yellow-800',
  padrino: 'bg-amber-100 text-amber-800',
}

const ESTADO_LABELS = {
  activa: 'Activa',
  pendiente_verificacion: 'Pendiente verificación',
  cerrada: 'Cerrada',
  activo: 'Activo',
  pendiente: 'Pendiente',
  padrino: 'Padrino',
}

export default function EstadoBadge({ estado }) {
  const style = ESTADO_STYLES[estado] ?? 'bg-gray-100 text-gray-600'
  const label = ESTADO_LABELS[estado] ?? estado

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {estado === 'padrino' && <span>★</span>}
      {label}
    </span>
  )
}
