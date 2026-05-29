import { useEffect, useState } from 'react'
import { getCountdown, formatCOP } from '../../utils/format'

export default function LiveBidTracker({
  mejorOferta,
  mejorOfertante,
  fechaCierre,
  closed = false,
  showButtons = true,
  onBid,
}) {
  const [countdown, setCountdown] = useState(() => getCountdown(fechaCierre))

  useEffect(() => {
    setCountdown(getCountdown(fechaCierre))
    const interval = setInterval(() => setCountdown(getCountdown(fechaCierre)), 1000)
    return () => clearInterval(interval)
  }, [fechaCierre])

  return (
    <div className="mt-2 bg-[#F0F2F5] rounded-lg p-3 text-sm space-y-2 border border-[#E9EDEF]">
      <p className="text-[#111B21]">
        💰 Mejor oferta:{' '}
        <strong>{formatCOP(mejorOferta)}</strong>
        {mejorOfertante && (
          <span className="text-[#667781]"> — {mejorOfertante}</span>
        )}
      </p>
      {!closed && (
        <p className="text-[#111B21]">
          ⏱ Cierra en: <span className="font-mono text-[#075E54] font-medium">{countdown}</span>
        </p>
      )}
      {showButtons && !closed && (
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            className="flex-1 text-xs bg-white border border-[#E9EDEF] rounded-full py-2 px-3 text-[#075E54] font-medium hover:bg-[#E9EDEF] transition-colors"
          >
            📋 Ver ficha
          </button>
          <button
            type="button"
            onClick={onBid}
            className="flex-1 text-xs bg-[#075E54] text-white rounded-full py-2 px-3 font-medium hover:bg-[#064E46] transition-colors"
          >
            💵 Hacer oferta
          </button>
        </div>
      )}
    </div>
  )
}
