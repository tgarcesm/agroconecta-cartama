import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { MUNICIPIOS } from '../../constants/municipios'
import EstadoBadge from '../../components/admin/EstadoBadge'

const EMPTY_FORM = { nombre: '', municipio: '', hato_size: '', estado: 'activo' }

export default function GanaderosPage() {
  const [ganaderos, setGanaderos] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  async function fetchGanaderos() {
    const { data, error } = await supabase
      .from('ganaderos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setGanaderos(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchGanaderos()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('ganaderos').insert({
      nombre: form.nombre,
      municipio: form.municipio,
      hato_size: Number(form.hato_size) || null,
      estado: form.estado,
    })
    setSubmitting(false)
    if (!error) {
      setModalOpen(false)
      setForm(EMPTY_FORM)
      fetchGanaderos()
    }
  }

  const filtered = ganaderos.filter((g) => {
    const q = search.toLowerCase()
    return (
      g.nombre?.toLowerCase().includes(q) ||
      g.municipio?.toLowerCase().includes(q)
    )
  })

  function formatFecha(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('es-CO')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold text-primary">Ganaderos</h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Ganadero
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o municipio…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Municipio</th>
                <th className="px-4 py-3 font-medium">Tamaño hato</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Fecha registro</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Cargando…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No se encontraron ganaderos
                  </td>
                </tr>
              )}
              {filtered.map((g) => (
                <tr key={g.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-primary">{g.nombre}</td>
                  <td className="px-4 py-3">{g.municipio ?? '—'}</td>
                  <td className="px-4 py-3">{g.hato_size ?? '—'}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={g.estado} />
                  </td>
                  <td className="px-4 py-3">{formatFecha(g.created_at ?? g.fecha_registro)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-primary">Nuevo Ganadero</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                <input
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Municipio</label>
                <select
                  required
                  value={form.municipio}
                  onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar…</option>
                  {MUNICIPIOS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tamaño hato</label>
                <input
                  type="number"
                  value={form.hato_size}
                  onChange={(e) => setForm({ ...form, hato_size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="padrino">Padrino</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary text-background rounded-lg text-sm font-medium hover:bg-primary-light disabled:opacity-50"
                >
                  {submitting ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
