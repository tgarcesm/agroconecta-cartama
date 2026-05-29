import { useEffect, useRef, useState } from 'react'
import ChatBubble, { SystemMessage } from '../ChatBubble'
import LiveBidTracker from '../LiveBidTracker'
import ChatInputBar from '../ChatInputBar'
import { renderWhatsAppText } from '../ChatBubble'
import {
  getLoteId,
  getMunicipio,
  getCantidad,
  getGanaderoNombre,
  normalizeSubasta,
} from '../../../utils/subastas'

const MSG_045 = `🐄 *LOTE #AC-2024-045 | SUBASTA CERRADA ✓*
━━━━━━━━━━━━━━━
📍 Támesis · Finca verificada
🐄 5 terneros destetados · Angus
⚖️ Peso prom: 180 kg
💰 ADJUDICADO: $3.100.000
🏆 Comprador adjudicado
━━━━━━━━━━━━━━━
✅ Verificado en finca por Agroconecta`

function buildSubastaMessage(raw) {
  const subasta = normalizeSubasta(raw)
  const lote = getLoteId(subasta)
  const ganadero = getGanaderoNombre(subasta)
  const cantidad = getCantidad(subasta)
  return `🐄 *${lote} | ⏱ SUBASTA ACTIVA*
━━━━━━━━━━━━━━━
📍 ${getMunicipio(subasta)} · ${ganadero}
🐄 ${cantidad ?? '—'} animales · ${subasta.raza ?? '—'}
⚖️ Peso prom: ${subasta.peso_estimado ?? '—'} kg
💵 Precio base: $${Number(subasta.precio_base || 0).toLocaleString('es-CO')}
━━━━━━━━━━━━━━━
✅ Verificado en finca · Agroconecta`
}

function ActiveSubastaBubble({ subasta, closed, onBid }) {
  const normalized = normalizeSubasta(subasta)
  const msg = buildSubastaMessage(normalized)

  function handleBidClick() {
    onBid(normalized)
  }

  return (
    <div className="flex justify-start mb-1 px-3 md:px-6">
      <div className="relative max-w-[85%] md:max-w-[65%] px-3 py-2 pb-2 shadow-sm bg-white rounded-lg rounded-tl-none">
        <p className="text-sm text-[#111B21] whitespace-pre-wrap leading-relaxed">
          {renderWhatsAppText(msg)}
        </p>
        <LiveBidTracker
          mejorOferta={normalized.mejor_oferta}
          mejorOfertante={normalized.mejor_ofertante}
          fechaCierre={normalized.fecha_cierre}
          closed={closed || normalized.estado === 'cerrada'}
          showButtons={!closed && normalized.estado !== 'cerrada'}
          onBid={handleBidClick}
        />
        <span className="text-[10px] text-[#667781] float-right mt-1">ahora</span>
      </div>
    </div>
  )
}

export default function CanalSubastasChat({
  activeSubastas,
  liveMessages,
  loteClosed,
  onBid,
  isSubscribed = false,
  loading = false,
  useFallback = false,
}) {
  const bottomRef = useRef(null)
  const [lockMessage, setLockMessage] = useState(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [liveMessages, activeSubastas, lockMessage])

  function handleBidAttempt(subasta) {
    if (!isSubscribed) {
      setLockMessage('🔒 Necesitás suscripción para pujar. Escríbenos al chat principal 👆')
      onBid(null, { blocked: true })
      return
    }
    onBid(subasta)
  }

  const displaySubastas = activeSubastas.length > 0 ? activeSubastas : []

  return (
    <>
      <div className="flex-1 overflow-y-auto whatsapp-bg py-3">
        <SystemMessage>Canal oficial de subastas verificadas · Solo lotes verificados en finca</SystemMessage>

        {useFallback && (
          <SystemMessage>Modo demo — datos de respaldo (Supabase no disponible)</SystemMessage>
        )}

        <ChatBubble type="received" text={MSG_045} time="ayer 15:42" />

        {loading ? (
          <p className="text-center text-[#667781] text-sm py-6">Cargando…</p>
        ) : displaySubastas.length === 0 ? (
          <SystemMessage>No hay subastas activas en este momento</SystemMessage>
        ) : (
          displaySubastas.map((subasta) => (
            <ActiveSubastaBubble
              key={subasta.id}
              subasta={subasta}
              closed={loteClosed && getLoteId(subasta).includes('047')}
              onBid={handleBidAttempt}
            />
          ))
        )}

        {lockMessage && <SystemMessage>{lockMessage}</SystemMessage>}

        {liveMessages.map((msg) => (
          <ChatBubble key={msg.id ?? msg.text} type="received" text={msg.text} time={msg.time} />
        ))}

        <div ref={bottomRef} />
      </div>

      <ChatInputBar notice="🔒 Canal oficial · Solo el administrador puede publicar" />
    </>
  )
}
