import { formatCOP } from '../../utils/format'
import { PURCHASE_HISTORY } from '../../constants/compradores'

export default function MisPujasPanel({ sessionBids, subastas, buyerName }) {
  function getStatus(bid) {
    const subasta = subastas.find((s) => s.id === bid.subasta_id)
    if (!subasta) return { label: 'Superada', color: 'text-red-600', dot: '🔴' }

    const isWinning =
      subasta.mejor_ofertante === buyerName &&
      Number(subasta.mejor_oferta) === Number(bid.monto)

    if (isWinning) {
      return { label: 'Ganando', color: 'text-green-600', dot: '🟢' }
    }
    return { label: 'Superada', color: 'text-red-600', dot: '🔴' }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-primary mb-4">Mis pujas activas</h3>

        {sessionBids.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Aún no has hecho ofertas en esta sesión
          </p>
        ) : (
          <ul className="space-y-3">
            {sessionBids.map((bid, i) => {
              const status = getStatus(bid)
              return (
                <li
                  key={`${bid.subasta_id}-${bid.timestamp}-${i}`}
                  className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-primary text-sm truncate">{bid.lote}</p>
                      <p className="text-accent font-bold text-sm mt-0.5">{formatCOP(bid.monto)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(bid.timestamp).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${status.color}`}>
                      {status.dot} {status.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-primary mb-4">Historial de compras</h3>
        <ul className="space-y-3">
          {PURCHASE_HISTORY.map((item, i) => (
            <li key={i} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-primary text-sm">{item.ganadero}</p>
                  <p className="text-xs text-gray-500">{item.lote}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent text-sm">{formatCOP(item.monto)}</p>
                  <span className="inline-flex text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1">
                    {item.estado}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
