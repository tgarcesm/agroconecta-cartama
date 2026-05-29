import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function CompradoresPage() {
  const [compradores, setCompradores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompradores() {
      const { data, error } = await supabase
        .from('compradores')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) setCompradores(data)
      setLoading(false)
    }
    fetchCompradores()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Compradores</h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Municipio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Cargando…</td>
                </tr>
              )}
              {!loading && compradores.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    No hay compradores registrados
                  </td>
                </tr>
              )}
              {compradores.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-primary">{c.nombre ?? '—'}</td>
                  <td className="px-4 py-3">{c.empresa ?? '—'}</td>
                  <td className="px-4 py-3">{c.municipio ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {c.estado ?? 'Activo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
