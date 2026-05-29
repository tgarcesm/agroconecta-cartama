const HISTORY = [
  { date: '28 May 2026', ganadero: 'Don Hernando Ruiz', municipio: 'La Pintada', lote: 'Lote #038', estado: 'Verificada' },
  { date: '27 May 2026', ganadero: 'Finca El Roble', municipio: 'Valparaíso', lote: 'Lote #031', estado: 'Verificada' },
  { date: '26 May 2026', ganadero: 'Arturo Gómez', municipio: 'La Pintada', lote: 'Lote #029', estado: 'Verificada' },
  { date: '24 May 2026', ganadero: 'Pedro Ruiz', municipio: 'Támesis', lote: 'Lote #025', estado: 'Verificada' },
]

export default function Historial() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-primary mb-4 md:mb-6">Historial</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500 bg-gray-50">
              <th className="px-4 md:px-6 py-3 font-medium">Fecha</th>
              <th className="px-4 md:px-6 py-3 font-medium">Ganadero</th>
              <th className="px-4 md:px-6 py-3 font-medium hidden sm:table-cell">Municipio</th>
              <th className="px-4 md:px-6 py-3 font-medium">Lote</th>
              <th className="px-4 md:px-6 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 md:px-6 py-3 text-gray-600">{row.date}</td>
                <td className="px-4 md:px-6 py-3 font-medium text-primary">{row.ganadero}</td>
                <td className="px-4 md:px-6 py-3 hidden sm:table-cell">{row.municipio}</td>
                <td className="px-4 md:px-6 py-3">{row.lote}</td>
                <td className="px-4 md:px-6 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {row.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
