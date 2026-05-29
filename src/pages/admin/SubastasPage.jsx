import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatCOP } from '../../utils/format'
import { normalizeSubastas, FALLBACK_SUBASTAS } from '../../utils/subastas'
import EstadoBadge from '../../components/admin/EstadoBadge'
import CountdownTimer from '../../components/admin/CountdownTimer'
import { getLoteId, getMunicipio, getCantidad, getGanaderoNombre } from '../../utils/subastas'

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'activa', label: 'Activas' },
  { id: 'pendiente_verificacion', label: 'Pendiente verificación' },
  { id: 'cerrada', label: 'Cerradas' },
]

export default function SubastasPage() {
  const [subastas, setSubastas] = useState([])
  const [filter, setFilter] = useState('todas')
  const [loading, setLoading] = useState(true)

  async function fetchSubastas() {
    const { data, error } = await supabase
      .from('subastas')
      .select('*, ganaderos(nombre, municipio)')
      .order('fecha_cierre', { ascending: true })

    if (!error && data?.length) {
      setSubastas(normalizeSubastas(data))
    } else {
      setSubastas(normalizeSubastas(FALLBACK_SUBASTAS))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSubastas()

    const channel = supabase
      .channel('subastas-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subastas' }, () => {
        fetchSubastas()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filtered =
    filter === 'todas' ? subastas : subastas.filter((s) => s.estado === filter)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Subastas</h2>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-primary text-background'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No hay subastas en esta categoría</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="bg-primary px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-background font-semibold">{getGanaderoNombre(s)}</p>
                  <p className="text-background/70 text-sm">{getMunicipio(s)}</p>
                </div>
                <EstadoBadge estado={s.estado} />
              </div>

              <div className="p-4 flex-1 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Lote</span>
                  <span className="font-medium">{getLoteId(s)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Raza</span>
                  <span className="font-medium">{s.raza ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cantidad</span>
                  <span className="font-medium">{getCantidad(s) ?? '—'} animales</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Peso estimado</span>
                  <span className="font-medium">{s.peso_estimado ? `${s.peso_estimado} kg` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Precio base</span>
                  <span className="font-medium">{formatCOP(s.precio_base)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-500">Mejor oferta</span>
                  <span className="font-bold text-accent">{formatCOP(s.mejor_oferta)}</span>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <CountdownTimer fechaCierre={s.fecha_cierre} />
                <button
                  type="button"
                  className="text-sm bg-primary text-background px-4 py-1.5 rounded-md hover:bg-primary-light transition-colors"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
