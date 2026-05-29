import { useEffect, useState } from 'react'
import { Users, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { formatCOP, formatDate, timeAgo } from '../../utils/format'
import EstadoBadge from '../../components/admin/EstadoBadge'
import CountdownTimer from '../../components/admin/CountdownTimer'

const CHART_DATA = [
  { trimestre: 'T1', Proyectado: 75.8, Meta: 80 },
  { trimestre: 'T2', Proyectado: 161.5, Meta: 170 },
  { trimestre: 'T3', Proyectado: 278.3, Meta: 290 },
  { trimestre: 'T4', Proyectado: 395.9, Meta: 410 },
]

const RECENT_ACTIVITY = [
  { type: 'positive', text: 'Verificación completada — Lote Don Hernando', time: '2026-05-29T08:30:00' },
  { type: 'positive', text: 'Nueva puja — $8.200.000 Frigorífico El Rebaño', time: '2026-05-29T07:45:00' },
  { type: 'positive', text: 'Nuevo suscriptor — Arturo Gómez, La Pintada', time: '2026-05-28T16:20:00' },
  { type: 'pending', text: 'Verificación pendiente — Lote Finca El Roble', time: '2026-05-28T14:00:00' },
  { type: 'positive', text: 'Subasta cerrada — Lote #042, $12.500.000', time: '2026-05-28T11:30:00' },
  { type: 'pending', text: 'Documentos en revisión — Ganadero Pedro Ruiz', time: '2026-05-27T09:15:00' },
]

function KpiCard({ label, value, sub, icon: Icon, iconColor = 'text-primary' }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg bg-primary/10 ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-bold text-primary mt-1">{value}</p>
        <p className="text-gray-400 text-sm mt-1">{sub}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [ganaderosCount, setGanaderosCount] = useState('—')
  const [compradoresCount, setCompradoresCount] = useState('—')
  const [subastas, setSubastas] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchSubastasActivas() {
    const { data, error } = await supabase
      .from('subastas')
      .select('*, ganaderos(nombre)')
      .eq('estado', 'activa')
      .order('fecha_cierre', { ascending: true })

    if (!error && data) setSubastas(data)
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [ganRes, compRes] = await Promise.all([
        supabase.from('ganaderos').select('*', { count: 'exact', head: true }),
        supabase.from('compradores').select('*', { count: 'exact', head: true }),
      ])
      setGanaderosCount(ganRes.count ?? 0)
      setCompradoresCount(compRes.count ?? 0)
      await fetchSubastasActivas()
      setLoading(false)
    }

    fetchData()

    const channel = supabase
      .channel('dashboard-subastas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subastas' }, () => {
        fetchSubastasActivas()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">Buenos días, Administrador</h2>
        <p className="text-gray-500 capitalize">{formatDate()}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Ganaderos suscritos"
          value={loading ? '…' : ganaderosCount}
          sub="/ meta 250"
          icon={Users}
        />
        <KpiCard
          label="Compradores activos"
          value={loading ? '…' : compradoresCount}
          sub="/ meta 130"
          icon={ShoppingBag}
        />
        <KpiCard
          label="Cabezas esta semana"
          value="90"
          sub="meta: 500/sem año 1"
          icon={TrendingUp}
        />
        <KpiCard
          label="Ingresos semana"
          value="$4.2M"
          sub="COP"
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-semibold text-primary mb-4">Subastas Activas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 pr-3 font-medium">Lote</th>
                  <th className="pb-3 pr-3 font-medium">Ganadero</th>
                  <th className="pb-3 pr-3 font-medium">Municipio</th>
                  <th className="pb-3 pr-3 font-medium">Mejor Oferta</th>
                  <th className="pb-3 pr-3 font-medium">Tiempo restante</th>
                  <th className="pb-3 pr-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {subastas.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No hay subastas activas
                    </td>
                  </tr>
                )}
                {subastas.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-3 font-medium text-primary">{s.lote ?? s.id}</td>
                    <td className="py-3 pr-3">{s.ganaderos?.nombre ?? '—'}</td>
                    <td className="py-3 pr-3">{s.municipio ?? '—'}</td>
                    <td className="py-3 pr-3 font-semibold">{formatCOP(s.mejor_oferta)}</td>
                    <td className="py-3 pr-3">
                      <CountdownTimer fechaCierre={s.fecha_cierre} />
                    </td>
                    <td className="py-3 pr-3">
                      <EstadoBadge estado={s.estado} />
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        className="text-xs bg-primary text-background px-3 py-1 rounded-md hover:bg-primary-light transition-colors"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-semibold text-primary mb-4">Proyección de Ingresos Año 1</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={CHART_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="trimestre" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: 'Millones COP', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
              />
              <Tooltip formatter={(v) => [`${v} M`, '']} />
              <Legend />
              <Bar dataKey="Proyectado" fill="#1E4D2B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Meta" fill="#8B6914" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-primary mb-4">Actividad Reciente</h3>
        <ul className="space-y-3">
          {RECENT_ACTIVITY.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.type === 'positive' ? 'bg-primary' : 'bg-accent'
                }`}
              />
              <span className="flex-1 text-gray-700">{item.text}</span>
              <span className="text-gray-400 text-xs shrink-0">{timeAgo(item.time)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
