export function formatCOP(value) {
  if (value == null || value === '') return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return '—'
  return `$${num.toLocaleString('es-CO')}`
}

export function formatCOPShort(value) {
  if (value == null || value === '') return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return '—'
  return `$${num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatMiles(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return '—'
  return `$${num.toLocaleString('es-CO', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
}

export function getCountdown(fechaCierre) {
  if (!fechaCierre) return '—'
  const diff = new Date(fechaCierre).getTime() - Date.now()
  if (diff <= 0) return 'Cerrada'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    const remHours = hours % 24
    return `${days}d ${remHours}h`
  }
  return `${hours}h ${minutes}m ${seconds}s`
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Hace un momento'
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `Hace ${days} d`
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
