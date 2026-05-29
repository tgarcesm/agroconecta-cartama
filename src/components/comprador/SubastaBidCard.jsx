import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { formatCOP } from '../../utils/format'
import CountdownTimer from '../admin/CountdownTimer'
import {
  getLoteId,
  getMunicipio,
  getCantidad,
  getGanaderoNombre,
} from '../../utils/subastas'

const MIN_INCREMENT = 100000

export default function SubastaBidCard({
  subasta,
  buyerName,
  onBidSuccess,
}) {
  const normalized = {
    ...subasta,
    lote: getLoteId(subasta),
    municipio: getMunicipio(subasta),
    cantidad: getCantidad(subasta),
    ganaderoNombre: getGanaderoNombre(subasta),
  }

  const mejorOferta = Number(normalized.mejor_oferta) || 0
  const [bidAmount, setBidAmount] = useState(mejorOferta + MIN_INCREMENT)
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setBidAmount(mejorOferta + MIN_INCREMENT)
  }, [mejorOferta])

  async function handleBid() {
    setError('')
    const monto = Number(bidAmount)

    if (!monto || monto <= mejorOferta) {
      setError(`La oferta debe ser mayor a ${formatCOP(mejorOferta)}`)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setSubmitting(true)
    const success = await onBidSuccess(normalized, monto)
    setSubmitting(false)

    if (success) {
      setFlash(true)
      setTimeout(() => setFlash(false), 2500)
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        flash ? 'ring-2 ring-green-400 ring-offset-2' : ''
      }`}
    >
      {flash && (
        <div className="bg-green-500 text-white text-center text-sm font-medium py-2 animate-fade-in">
          ✓ Oferta registrada · visible en Canal WhatsApp
        </div>
      )}

      <div className="bg-primary px-4 py-2 flex items-center justify-between">
        <span className="text-background text-xs font-bold tracking-wide">SUBASTA ACTIVA</span>
        <span className="text-background text-xs font-medium flex items-center gap-1">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          EN VIVO
        </span>
      </div>

      <div className="p-4 md:p-5 space-y-3">
        <div>
          <h3 className="font-bold text-primary text-lg">{normalized.ganaderoNombre}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            {normalized.municipio}
          </p>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p><span className="text-gray-500">Lote:</span> {normalized.lote}</p>
          <p><span className="text-gray-500">Raza:</span> {normalized.raza ?? '—'}</p>
          <p><span className="text-gray-500">Cantidad:</span> {normalized.cantidad ?? '—'} animales</p>
          <p><span className="text-gray-500">Peso estimado:</span> {normalized.peso_estimado ? `${normalized.peso_estimado} kg` : '—'}</p>
        </div>

        <p className="text-xs text-primary bg-primary/5 rounded-lg px-3 py-2">
          ✅ Verificado en finca por Agroconecta
        </p>

        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-800">
            💰 Mejor oferta:{' '}
            <strong className="text-accent text-base">{formatCOP(normalized.mejor_oferta)}</strong>
            {normalized.mejor_ofertante && (
              <span className="text-gray-600"> — {normalized.mejor_ofertante}</span>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ⏱ Cierra en: <CountdownTimer fechaCierre={normalized.fecha_cierre} />
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2">
          <label className="block text-sm font-medium text-primary">Tu oferta (COP):</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              shake ? 'animate-shake border-red-400' : 'border-gray-200'
            }`}
            step={50000}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <p className="text-xs text-gray-400">
            Oferta mínima: {formatCOP(mejorOferta + MIN_INCREMENT)}
          </p>
          <button
            type="button"
            onClick={handleBid}
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-light text-background font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? 'Registrando…' : '🔨 Hacer oferta'}
          </button>
        </div>
      </div>
    </div>
  )
}
