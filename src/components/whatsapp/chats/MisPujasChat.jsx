import { formatCOP } from '../../../utils/format'
import { PURCHASE_HISTORY } from '../../../constants/compradores'
import ChatInputBar from '../ChatInputBar'

export default function MisPujasChat({ sessionBids, subastas, buyerName }) {
  function getStatus(bid) {
    const subasta = subastas.find((s) => s.id === bid.subasta_id)
    if (!subasta) return { label: 'Superada', dot: '🔴', color: 'text-red-600' }
    const winning =
      subasta.mejor_ofertante === buyerName &&
      Number(subasta.mejor_oferta) === Number(bid.monto)
    return winning
      ? { label: 'Ganando', dot: '🟢', color: 'text-green-600' }
      : { label: 'Superada', dot: '🔴', color: 'text-red-600' }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto whatsapp-bg py-3 px-3 md:px-6 space-y-3">
        <div className="bg-[#FFF3CD]/90 text-[#54656F] text-xs px-3 py-2 rounded-lg text-center">
          Tus pujas activas en subastas del canal
        </div>

        {sessionBids.length === 0 ? (
          <p className="text-center text-[#667781] text-sm py-8">
            Aún no has pujado. Ve al Canal Subastas y toca &quot;Hacer oferta&quot;
          </p>
        ) : (
          sessionBids.map((bid, i) => {
            const status = getStatus(bid)
            return (
              <div key={`${bid.subasta_id}-${i}`} className="bg-white rounded-lg shadow-sm p-4 border border-[#E9EDEF]">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-medium text-[#111B21] text-sm">{bid.lote}</p>
                    <p className="text-[#075E54] font-bold mt-1">{formatCOP(bid.monto)}</p>
                    <p className="text-[10px] text-[#667781] mt-1">
                      {new Date(bid.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${status.color}`}>
                    {status.dot} {status.label}
                  </span>
                </div>
              </div>
            )
          })
        )}

        <div className="pt-4">
          <p className="text-xs font-semibold text-[#667781] uppercase tracking-wide mb-2 px-1">
            Historial de compras
          </p>
          {PURCHASE_HISTORY.map((item, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 border border-[#E9EDEF] mb-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-sm text-[#111B21]">{item.ganadero}</p>
                  <p className="text-xs text-[#667781]">{item.lote}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-[#8B6914]">{formatCOP(item.monto)}</p>
                  <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {item.estado}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ChatInputBar />
    </>
  )
}
