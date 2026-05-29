import { useEffect, useRef } from 'react'
import ChatBubble, { SystemMessage, TypingIndicator } from '../ChatBubble'
import LiveBidTracker from '../LiveBidTracker'
import ChatInputBar from '../ChatInputBar'
import { renderWhatsAppText } from '../ChatBubble'

const MSG_045 = `🐄 *LOTE #AC-2024-045 | SUBASTA CERRADA ✓*
━━━━━━━━━━━━━━━
📍 Támesis · Don Hernando Ríos
🐄 5 terneros destetados · Angus
⚖️ Peso prom: 180 kg
💰 ADJUDICADO: $3.100.000
🏆 Comprador: Don Marco Ospina
━━━━━━━━━━━━━━━
✅ Verificado en finca por Carlos Mendoza`

function buildSubastaMessage(subasta) {
  const ganadero = subasta.ganaderos?.nombre ?? 'Ganadero'
  const lote = subasta.lote ?? `#${subasta.id}`
  return `🐄 *${lote} | ⏱ SUBASTA ACTIVA*
━━━━━━━━━━━━━━━
📍 ${subasta.municipio ?? '—'} · ${ganadero}
🐄 ${subasta.cantidad_animales ?? '—'} animales · ${subasta.raza ?? '—'}
⚖️ Peso prom: ${subasta.peso_estimado ?? '—'} kg
💵 Precio base: $${Number(subasta.precio_base || 0).toLocaleString('es-CO')}
━━━━━━━━━━━━━━━
✅ Verificado en finca · Agroconecta`
}

function ActiveSubastaBubble({ subasta, closed, onBid }) {
  const msg = buildSubastaMessage(subasta)
  return (
    <div className="flex justify-start mb-1 px-3 md:px-6">
      <div className="relative max-w-[85%] md:max-w-[65%] px-3 py-2 pb-2 shadow-sm bg-white rounded-lg rounded-tl-none">
        <p className="text-sm text-[#111B21] whitespace-pre-wrap leading-relaxed">
          {renderWhatsAppText(msg)}
        </p>
        <LiveBidTracker
          mejorOferta={subasta.mejor_oferta}
          mejorOfertante={subasta.mejor_ofertante}
          fechaCierre={subasta.fecha_cierre}
          closed={closed || subasta.estado === 'cerrada'}
          showButtons={!closed && subasta.estado !== 'cerrada'}
          onBid={() => onBid(subasta)}
        />
        <span className="text-[10px] text-[#667781] float-right mt-1">ahora</span>
      </div>
    </div>
  )
}

export default function CanalSubastasChat({
  activeSubastas,
  demoMessages,
  liveMessages,
  typing,
  loteClosed,
  onBid,
  buyer,
}) {
  const bottomRef = useRef(null)
  const allMessages = [...liveMessages, ...demoMessages]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages, typing, activeSubastas])

  return (
    <>
      <div className="flex-1 overflow-y-auto whatsapp-bg py-3">
        <SystemMessage>Canal oficial de subastas verificadas · Solo lotes verificados en finca</SystemMessage>

        <ChatBubble type="received" text={MSG_045} time="ayer 15:42" />

        {activeSubastas.length === 0 ? (
          <div className="flex justify-start mb-1 px-3 md:px-6">
            <div className="relative max-w-[85%] md:max-w-[65%] px-3 py-2 pb-2 shadow-sm bg-white rounded-lg rounded-tl-none">
              <p className="text-sm text-[#111B21] whitespace-pre-wrap leading-relaxed">
                {renderWhatsAppText(`🐄 *LOTE #AC-2024-047 | ⏱ SUBASTA ACTIVA*  
━━━━━━━━━━━━━━━
📍 Támesis · Don Hernando Ríos
🐄 12 novillos cebados · Brahman x Angus
⚖️ Peso prom: 420 kg
💵 Precio base: $7.800.000
━━━━━━━━━━━━━━━
✅ Verificado en finca · 4 fotos · 1 video`)}
              </p>
              <LiveBidTracker
                mejorOferta={7800000}
                mejorOfertante="Ganadería Los Pinos"
                fechaCierre={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()}
                closed={loteClosed}
                showButtons={!loteClosed}
                onBid={() => onBid?.({ id: null, lote: 'AC-2024-047', mejor_oferta: 7800000 })}
              />
              <span className="text-[10px] text-[#667781] float-right mt-1">ahora</span>
            </div>
          </div>
        ) : (
          activeSubastas.map((subasta) => (
            <ActiveSubastaBubble
              key={subasta.id}
              subasta={subasta}
              closed={loteClosed && subasta.lote?.includes('047')}
              onBid={onBid}
            />
          ))
        )}

        {buyer && (
          <div className="flex justify-center my-2 px-4">
            <span className="text-[10px] text-[#667781] bg-white/80 px-3 py-1 rounded-full">
              Puja como {buyer.emoji} {buyer.name}
            </span>
          </div>
        )}

        {allMessages.map((msg) => (
          <ChatBubble key={msg.id ?? msg.text} type="received" text={msg.text} time={msg.time} />
        ))}

        {typing && (
          <div className="px-3 md:px-6 mb-2">
            <p className="text-xs text-[#667781] mb-1">Agroconecta está escribiendo...</p>
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInputBar notice="🔒 Canal oficial · Solo el administrador puede publicar" />
    </>
  )
}
