import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatCOP } from '../utils/format'
import GlobalNav from '../components/layout/GlobalNav'
import ChatSidebar from '../components/whatsapp/ChatSidebar'
import ChatHeader from '../components/whatsapp/ChatHeader'
import CanalSubastasChat from '../components/whatsapp/chats/CanalSubastasChat'
import DonHernandoChat from '../components/whatsapp/chats/DonHernandoChat'
import FrigorificoChat from '../components/whatsapp/chats/FrigorificoChat'
import MisPujasChat from '../components/whatsapp/chats/MisPujasChat'
import BuyerIdentityModal from '../components/whatsapp/BuyerIdentityModal'
import BidModal from '../components/whatsapp/BidModal'
import ConfettiOverlay from '../components/whatsapp/ConfettiOverlay'

const LOTE_ID = 'AC-2024-047'
const BUYER_STORAGE_KEY = 'agroconecta-buyer'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function loadStoredBuyer() {
  try {
    const raw = localStorage.getItem(BUYER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function WhatsApp() {
  const [activeChat, setActiveChat] = useState('canal')
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [activeSubastas, setActiveSubastas] = useState([])
  const [liveSubasta, setLiveSubasta] = useState(null)
  const [demoMessages, setDemoMessages] = useState([])
  const [liveMessages, setLiveMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [demoRunning, setDemoRunning] = useState(false)
  const [loteClosed, setLoteClosed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [canalPreview, setCanalPreview] = useState('LOTE ADJUDICADO ✓')

  const [buyer, setBuyer] = useState(loadStoredBuyer)
  const [showIdentityModal, setShowIdentityModal] = useState(false)
  const [bidTarget, setBidTarget] = useState(null)
  const [sessionBids, setSessionBids] = useState([])
  const seenPujaIds = useRef(new Set())

  function selectBuyer(identity) {
    setBuyer(identity)
    localStorage.setItem(BUYER_STORAGE_KEY, JSON.stringify(identity))
  }

  const fetchActiveSubastas = useCallback(async () => {
    const { data } = await supabase
      .from('subastas')
      .select('*, ganaderos(nombre)')
      .eq('estado', 'activa')
      .order('fecha_cierre', { ascending: true })

    setActiveSubastas(data ?? [])

    const lote47 = data?.find((s) => s.lote?.includes('047') || s.lote === LOTE_ID)
    if (lote47) {
      setLiveSubasta(lote47)
      setLoteClosed(false)
    } else {
      const { data: closed } = await supabase
        .from('subastas')
        .select('*')
        .or(`lote.eq.${LOTE_ID},lote.ilike.%047%`)
        .eq('estado', 'cerrada')
        .maybeSingle()
      if (closed) {
        setLiveSubasta(closed)
        setLoteClosed(true)
      }
    }
  }, [])

  const handleNewPuja = useCallback(async (puja) => {
    if (!puja?.id || seenPujaIds.current.has(puja.id)) return
    seenPujaIds.current.add(puja.id)

    const { data: subasta } = await supabase
      .from('subastas')
      .select('lote')
      .eq('id', puja.subasta_id)
      .maybeSingle()

    const lote = subasta?.lote ?? `#${puja.subasta_id}`
    setCanalPreview(`${puja.comprador} · ${formatCOP(puja.monto)}`)

    setLiveMessages((prev) => [
      ...prev,
      {
        id: `puja-${puja.id}`,
        text: `🔔 *NUEVA PUJA* — ${puja.comprador} ofrece ${formatCOP(puja.monto)} por ${lote}`,
        time: 'ahora',
      },
    ])

    await fetchActiveSubastas()
  }, [fetchActiveSubastas])

  useEffect(() => {
    fetchActiveSubastas()

    const channel = supabase
      .channel('whatsapp-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subastas' }, (payload) => {
        fetchActiveSubastas()

        if (payload.eventType === 'UPDATE') {
          const updated = payload.new
          if (updated.estado === 'cerrada' && payload.old?.estado === 'activa') {
            setCanalPreview(`¡${updated.lote ?? 'Lote'} ADJUDICADO! ✓`)
            setLiveMessages((prev) => {
              const id = `cerrada-${updated.id}`
              if (prev.some((m) => m.id === id)) return prev
              return [
                ...prev,
                {
                  id,
                  text: `🔨 *¡${updated.lote ?? 'LOTE'} ADJUDICADO!*
━━━━━━━━━━━━━━━
🏆 Ganador: ${updated.mejor_ofertante ?? '—'}
💰 Precio final: ${formatCOP(updated.mejor_oferta)}
📋 Guía ICA en proceso
✅ Coordinando transporte`,
                  time: 'ahora',
                },
              ]
            })
            if (updated.lote?.includes('047')) {
              setLoteClosed(true)
              setShowConfetti(true)
              setTimeout(() => setShowConfetti(false), 5000)
            }
          }
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pujas' }, (payload) => {
        handleNewPuja(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchActiveSubastas, handleNewPuja])

  async function handleBid(subasta, monto) {
    if (!buyer) return false

    const mejorOferta = Number(subasta.mejor_oferta) || 0
    if (monto <= mejorOferta) return false

    if (!subasta.id) return false

    const { error: pujaError } = await supabase.from('pujas').insert({
      subasta_id: subasta.id,
      comprador: buyer.name,
      monto,
    })
    if (pujaError) return false

    const { error: updateError } = await supabase
      .from('subastas')
      .update({ mejor_oferta: monto, mejor_ofertante: buyer.name })
      .eq('id', subasta.id)
    if (updateError) return false

    setSessionBids((prev) => [
      {
        subasta_id: subasta.id,
        lote: subasta.lote ?? `Lote #${subasta.id}`,
        monto,
        timestamp: new Date().toISOString(),
        comprador: buyer.name,
      },
      ...prev,
    ])

    return true
  }

  function requestBid(subasta) {
    if (!buyer) {
      setShowIdentityModal(true)
      setBidTarget(subasta)
      return
    }
    setBidTarget(subasta)
  }

  async function updateSubasta(fields) {
    if (!liveSubasta?.id) {
      setLiveSubasta((prev) => ({ ...prev, ...fields }))
      return
    }
    await supabase.from('subastas').update(fields).eq('id', liveSubasta.id)
    setLiveSubasta((prev) => ({ ...prev, ...fields }))
    await fetchActiveSubastas()
  }

  async function runDemo() {
    if (demoRunning) return
    setDemoRunning(true)
    setDemoMessages([])
    setLoteClosed(false)
    setShowConfetti(false)
    setActiveChat('canal')
    setMobileShowChat(true)

    setTyping(true)
    await delay(2000)
    setTyping(false)

    setDemoMessages([
      { id: 'demo-1', text: '🔔 *NUEVA PUJA* — Carnes Cartama ofrece $8.500.000 por Lote #AC-2024-047', time: 'ahora' },
    ])
    setCanalPreview('Carnes Cartama · $8.500.000')
    await updateSubasta({ mejor_oferta: 8500000, mejor_ofertante: 'Carnes Cartama' })

    await delay(3000)
    setDemoMessages((m) => [
      ...m,
      { id: 'demo-2', text: '🔔 *NUEVA PUJA* — Frigorífico El Rebaño sube a $9.100.000', time: 'ahora' },
    ])
    setCanalPreview('Frigorífico El Rebaño · $9.100.000')
    await updateSubasta({ mejor_oferta: 9100000, mejor_ofertante: 'Frigorífico El Rebaño' })

    await delay(3000)
    setDemoMessages((m) => [
      ...m,
      {
        id: 'demo-3',
        text: `🔨 *¡LOTE #AC-2024-047 ADJUDICADO!*
━━━━━━━━━━━━━━━
🏆 Ganador: Frigorífico El Rebaño
💰 Precio final: $9.100.000
📋 Guía ICA en proceso
✅ Coordinando transporte`,
        time: 'ahora',
      },
    ])
    setCanalPreview('LOTE ADJUDICADO ✓')
    await updateSubasta({
      mejor_oferta: 9100000,
      mejor_ofertante: 'Frigorífico El Rebaño',
      estado: 'cerrada',
    })
    setLoteClosed(true)
    setShowConfetti(true)
    setDemoRunning(false)

    setTimeout(() => setShowConfetti(false), 5000)
  }

  function handleSelectChat(id) {
    setActiveChat(id)
    setMobileShowChat(true)
  }

  function renderChat() {
    switch (activeChat) {
      case 'hernando':
        return <DonHernandoChat />
      case 'frigorifico':
        return <FrigorificoChat />
      case 'mis-pujas':
        return (
          <MisPujasChat
            sessionBids={sessionBids}
            subastas={activeSubastas}
            buyerName={buyer?.name}
          />
        )
      default:
        return (
          <CanalSubastasChat
            activeSubastas={activeSubastas}
            demoMessages={demoMessages}
            liveMessages={liveMessages}
            typing={typing}
            loteClosed={loteClosed}
            onBid={requestBid}
            buyer={buyer}
          />
        )
    }
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#D1D7DB]">
      <div className="hidden md:block">
        <GlobalNav active="whatsapp" />
      </div>

      <div className="flex-1 flex overflow-hidden layout-with-nav-mobile-off md:md-layout-with-nav min-h-0 relative">
        <ChatSidebar
          activeId={activeChat}
          onSelect={handleSelectChat}
          hidden={mobileShowChat}
          canalPreview={canalPreview}
          buyer={buyer}
          onChangeBuyer={() => setShowIdentityModal(true)}
        />

        <div
          className={`${mobileShowChat ? 'flex' : 'hidden'} md:flex flex-col flex-1 min-w-0 h-full relative`}
        >
          <ChatHeader
            chatId={activeChat}
            showBack={mobileShowChat}
            onBack={() => setMobileShowChat(false)}
          />
          {renderChat()}

          {activeChat === 'canal' && (
            <button
              type="button"
              onClick={runDemo}
              disabled={demoRunning}
              className="demo-pulse-btn fixed bottom-20 md:bottom-8 right-4 md:right-8 z-20 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 disabled:opacity-60 transition-opacity"
            >
              ▶ Demo en vivo
            </button>
          )}
        </div>

        <ConfettiOverlay active={showConfetti} />
      </div>

      {showIdentityModal && (
        <BuyerIdentityModal
          onSelect={(identity) => {
            selectBuyer(identity)
            setShowIdentityModal(false)
          }}
          onClose={() => setShowIdentityModal(false)}
        />
      )}

      {bidTarget && buyer && !showIdentityModal && (
        <BidModal
          subasta={activeSubastas.find((s) => s.id === bidTarget.id) ?? bidTarget}
          buyer={buyer}
          onClose={() => setBidTarget(null)}
          onSubmit={handleBid}
        />
      )}
    </div>
  )
}
