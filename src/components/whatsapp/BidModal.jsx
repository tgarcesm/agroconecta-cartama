import { useEffect, useState } from 'react'
import { formatCOP } from '../../utils/format'

const MIN_INCREMENT = 100000

export default function BidModal({ subasta, buyer, onClose, onSubmit }) {
  const mejorOferta = Number(subasta?.mejor_oferta) || 0
  const [monto, setMonto] = useState(mejorOferta + MIN_INCREMENT)
  const [shake, setShake] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setMonto(mejorOferta + MIN_INCREMENT)
  }, [mejorOferta])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const amount = Number(monto)

    if (amount <= mejorOferta) {
      setError(`Debe superar ${formatCOP(mejorOferta)}`)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setSubmitting(true)
    const ok = await onSubmit(subasta, amount)
    setSubmitting(false)

    if (ok) {
      setSuccess(true)
      setTimeout(onClose, 1200)
    }
  }

  const lote = subasta?.lote ?? `#${subasta?.id}`

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-sm rounded-t-2xl md:rounded-2xl overflow-hidden animate-fade-in">
        <div className="bg-[#075E54] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">💵 Hacer oferta</p>
            <p className="text-white/70 text-xs">{lote}</p>
          </div>
          <button type="button" onClick={onClose} className="text-white/80 text-xl leading-none px-2">
            ×
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-3">✓</p>
            <p className="text-[#075E54] font-semibold">¡Oferta registrada!</p>
            <p className="text-[#667781] text-sm mt-1">Publicada en el canal</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-sm text-[#667781]">
              Puja como <strong className="text-[#111B21]">{buyer?.emoji} {buyer?.name}</strong>
            </p>

            <div className="bg-[#F0F2F5] rounded-lg p-3 text-sm">
              <p>Mejor oferta actual: <strong>{formatCOP(mejorOferta)}</strong></p>
              {subasta?.mejor_ofertante && (
                <p className="text-[#667781] text-xs mt-0.5">— {subasta.mejor_ofertante}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-[#667781] mb-1">Tu oferta (COP)</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#075E54]/30 ${
                  shake ? 'animate-shake border-red-400' : 'border-[#E9EDEF]'
                }`}
                step={50000}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <p className="text-xs text-[#667781] mt-1">
                Mínima: {formatCOP(mejorOferta + MIN_INCREMENT)}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#075E54] text-white font-medium py-3 rounded-xl hover:bg-[#064E46] disabled:opacity-50"
            >
              {submitting ? 'Enviando…' : '🔨 Confirmar oferta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
