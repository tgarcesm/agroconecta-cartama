import { formatMiles } from '../../utils/format'

const ROWS = [
  { concepto: 'Suscripciones', t1: 5.625, t2: 9.0, t3: 13.5, t4: 18.75, total: 46.875 },
  { concepto: 'Comisiones (1.5%)', t1: 66.838, t2: 148.53, t3: 259.928, t4: 371.326, total: 846.622 },
  { concepto: 'Programa Padrino', t1: 3.375, t2: 4.05, t3: 4.95, t4: 5.85, total: 18.225 },
  {
    concepto: 'TOTAL INGRESOS',
    t1: 75.838,
    t2: 161.58,
    t3: 278.378,
    t4: 395.926,
    total: 911.722,
    bold: true,
    color: 'text-primary',
  },
  {
    concepto: 'Gastos operativos',
    t1: -70.116,
    t2: -70.116,
    t3: -70.116,
    t4: -70.116,
    total: -280.464,
    negative: true,
  },
  {
    concepto: 'UTILIDAD OPERACIONAL',
    t1: 5.722,
    t2: 91.464,
    t3: 208.262,
    t4: 325.81,
    total: 631.258,
    bold: true,
    color: 'text-accent',
  },
]

const HIGHLIGHTS = [
  { label: 'Margen operacional', value: '69.2%' },
  { label: 'Punto de equilibrio', value: '70 cabezas/semana' },
  { label: 'Inversión inicial recuperada', value: 'Año 1' },
]

function Cell({ value, bold, color, negative }) {
  const formatted = formatMiles(Math.abs(value))
  const display = negative ? `-${formatted}` : formatted
  return (
    <td className={`px-4 py-3 text-right ${bold ? 'font-bold' : ''} ${color ?? 'text-gray-700'}`}>
      {display}
    </td>
  )
}

export default function FinanzasPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">Proyección Financiera Año 1</h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
                <th className="px-4 py-3 font-medium">Concepto</th>
                <th className="px-4 py-3 font-medium text-right">T1</th>
                <th className="px-4 py-3 font-medium text-right">T2</th>
                <th className="px-4 py-3 font-medium text-right">T3</th>
                <th className="px-4 py-3 font-medium text-right">T4</th>
                <th className="px-4 py-3 font-medium text-right">Total Año 1</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.concepto}
                  className={`border-b border-gray-100 last:border-0 ${
                    row.bold ? 'bg-gray-50/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className={`px-4 py-3 ${row.bold ? 'font-bold' : ''} ${row.color ?? 'text-gray-700'}`}>
                    {row.concepto}
                  </td>
                  <Cell value={row.t1} bold={row.bold} color={row.color} negative={row.negative} />
                  <Cell value={row.t2} bold={row.bold} color={row.color} negative={row.negative} />
                  <Cell value={row.t3} bold={row.bold} color={row.color} negative={row.negative} />
                  <Cell value={row.t4} bold={row.bold} color={row.color} negative={row.negative} />
                  <Cell value={row.total} bold={row.bold} color={row.color} negative={row.negative} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          Valores en miles COP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className="bg-white rounded-xl shadow-md p-5 text-center">
            <p className="text-sm text-gray-500 mb-2">{h.label}</p>
            <p className="text-2xl font-bold text-primary">{h.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
