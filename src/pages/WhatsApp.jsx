import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatCOP } from '../utils/format'
import { normalizeSubastas, FALLBACK_SUBASTAS, getLoteId } from '../utils/subastas'
import { USER_IDENTITY } from '../utils/whatsapp'
import GlobalNav from '../components/layout/GlobalNav'
import ChatSidebar from '../components/whatsapp/ChatSidebar'
import ChatHeader from '../components/whatsapp/ChatHeader'
import CanalSubastasChat from '../components/whatsapp/chats/CanalSubastasChat'
import AgroconectaMainChat from '../components/whatsapp/chats/AgroconectaMainChat'
import BidModal from '../components/whatsapp/BidModal'
import ConfettiOverlay from '../components/whatsapp/ConfettiOverlay'

const LOTE_ID = 'AC-2024-047'
const USER_STORAGE_KEY = 'agroconecta-user'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const DEMO_STEPS = [
  'Usuario solicita acceso…',
  'Confirma el pago…',
  'Entra al canal de subastas…',
  'Hace su oferta…',
  'Otro comprador sube la puja…',
  '¡Lote adjudicado!',
]

export default function WhatsApp() {
  const storedUser = loadStoredUser()
  const mainChatRef = useRef(null)
  const demoRunningRef = useRef(false)

  const [activeChat, setActiveChat] = useState('main')
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [activeSubastas, setActiveSubastas] = useState([])
  const [liveSubasta, setLiveSubasta] = useState(null)
  const [liveMessages, setLiveMessages] = useState([])
  const [demoRunning, setDemoRunning] = useState(false)
  const [demoProgress, setDemoProgress] = useState(null)
  const [loteClosed, setLoteClosed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [canalPreview, setCanalPreview] = useState('Subastas en vivo')
  const [initialLoading, setInitialLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)
  const [highlightMain, setHighlightMain] = useState(false)

  const [user, setUser] = useState(storedUser)
  const [isSubscribed, setIsSubscribed] = useState(!!storedUser)
  const [bidTarget, setBidTarget] = useState(null)
  const [bidDemoAuto, setBidDemoAuto] = useState(null)
  const seenPujaIds = useRef(new Set())

  function activateSubscription() {
    setIsSubscribed(true)
    setUser(USER_IDENTITY)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(USER_IDENTITY))
  }

  const fetchActiveSubastas = useCallback(async (silent = false) => {
    if (!silent) setInitialLoading(true)

    const { data, error } = await supabase
      .from('subastas')
      .select('*, ganaderos(nombre, municipio)')
      .eq('estado', 'activa')
      .order('fecha_cierre', { ascending: true })

    if (error || !data?.length) {
      const fallback = normalizeSubastas(FALLBACK_SUBASTAS)
      setActiveSubastas(fallback)
      setUseFallback(!!error || !data?.length)
      const lote47 = fallback.find((s) => getLoteId(s).includes('047'))
      if (lote47) {
        setLiveSubasta(lote47)
        setLoteClosed(false)
      }
      if (!silent) setInitialLoading(false)
      return fallback
    }

    setUseFallback(false)
    const normalized = normalizeSubastas(data)
    setActiveSubastas(normalized)

    const lote47 = normalized.find((s) => getLoteId(s).includes('047') || getLoteId(s) === LOTE_ID)
    if (lote47) {
      setLiveSubasta(lote47)
      setLoteClosed(false)
    } else {
      const { data: closed } = await supabase
        .from('subastas')
        .select('*, ganaderos(nombre, municipio)')
        .or(`lote.eq.${LOTE_ID},lote.ilike.%047%,descripcion.ilike.%047%`)
        .eq('estado', 'cerrada')
        .maybeSingle()
      if (closed) {
        setLiveSubasta(normalizeSubastas([closed])[0])
        setLoteClosed(true)
      }
    }

    if (!silent) setInitialLoading(false)
    return normalized
  }, [])

  function appendCanalMessage(id, text) {
    setLiveMessages((prev) => {
      if (prev.some((m) => m.id === id)) return prev
      return [...prev, { id, text, time: 'ahora' }]
    })
  }

  function patchSubastaLocal(fields) {
    setLiveSubasta((prev) => (prev ? { ...prev, ...fields } : prev))
    setActiveSubastas((prev) =>
      prev.map((s) => {
        const match = liveSubasta ? s.id === liveSubasta.id : getLoteId(s).includes('047')
        return match ? { ...s, ...fields } : s
      })
    )
  }

  const handleNewPuja = useCallback(async (puja) => {
    if (demoRunningRef.current) return
    if (!puja?.id || seenPujaIds.current.has(puja.id)) return
    seenPujaIds.current.add(puja.id)

    const lote = liveSubasta ? getLoteId(liveSubasta) : `#${puja.subasta_id}`
    setCanalPreview(`${puja.comprador} · ${formatCOP(puja.monto)}`)
    appendCanalMessage(
      `puja-${puja.id}`,
      `🔔 *NUEVA PUJA* — ${puja.comprador} ofrece ${formatCOP(puja.monto)} por ${lote}`
    )
    await fetchActiveSubastas(true)
  }, [fetchActiveSubastas, liveSubasta])

  useEffect(() => {
    fetchActiveSubastas()

    const channel = supabase
      .channel('whatsapp-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subastas' }, (payload) => {
        if (demoRunningRef.current) return
        fetchActiveSubastas(true)

        if (payload.eventType === 'UPDATE') {
          const updated = payload.new
          if (updated.estado === 'cerrada' && payload.old?.estado === 'activa') {
            setCanalPreview('LOTE ADJUDICADO ✓')
            appendCanalMessage(
              `cerrada-${updated.id}`,
              `🔨 *¡${updated.lote ?? 'LOTE'} ADJUDICADO!*
━━━━━━━━━━━━━━━
🏆 Ganador: ${updated.mejor_ofertante ?? '—'}
💰 Precio final: ${formatCOP(updated.mejor_oferta)}
📋 Guía ICA en proceso
✅ Coordinando transporte`
            )
            if (String(updated.lote ?? '').includes('047') || String(updated.descripcion ?? '').includes('047')) {
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

    return () => supabase.removeChannel(channel)
  }, [fetchActiveSubastas, handleNewPuja])

  async function handleBid(subasta, monto) {
    if (!isSubscribed) return false

    const comprador = user?.name ?? USER_IDENTITY.name
    const mejorOferta = Number(subasta.mejor_oferta) || 0
    if (monto <= mejorOferta || !subasta.id) return false

    if (demoRunningRef.current || useFallback) {
      patchSubastaLocal({ mejor_oferta: monto, mejor_ofertante: comprador })
      const lote = getLoteId(subasta)
      setCanalPreview(`${comprador} · ${formatCOP(monto)}`)
      appendCanalMessage(
        `demo-puja-${Date.now()}`,
        `🔔 *NUEVA PUJA* — ${comprador} ofrece ${formatCOP(monto)} por ${lote}`
      )
      return true
    }

    const { error: pujaError } = await supabase.from('pujas').insert({
      subasta_id: subasta.id,
      comprador,
      monto,
    })
    if (pujaError) return false

    const { error: updateError } = await supabase
      .from('subastas')
      .update({ mejor_oferta: monto, mejor_ofertante: comprador })
      .eq('id', subasta.id)
    if (updateError) return false

    return true
  }

  function requestBid(subasta, meta) {
    if (meta?.blocked || !isSubscribed) {
      setHighlightMain(true)
      setTimeout(() => setHighlightMain(false), 4000)
      return
    }
    setBidDemoAuto(null)
    setBidTarget(subasta)
  }

  async function updateSubasta(fields, { silent = false } = {}) {
    patchSubastaLocal(fields)

    if (demoRunningRef.current || useFallback || silent) return

    if (liveSubasta?.id) {
      await supabase.from('subastas').update(fields).eq('id', liveSubasta.id)
    }
  }

  function getDemoSubasta() {
    return (
      liveSubasta ??
      activeSubastas.find((s) => getLoteId(s).includes('047')) ??
      activeSubastas[0]
    )
  }

  async function runDemoBid(subasta, monto) {
    setBidDemoAuto({ monto, submitAfter: 1800 })
    setBidTarget(subasta)
    await delay(3200)
    setBidTarget(null)
    setBidDemoAuto(null)
  }

  async function runDemo() {
    if (demoRunning) return

    demoRunningRef.current = true
    setDemoRunning(true)
    setLiveMessages([])
    setLoteClosed(false)
    setShowConfetti(false)
    setHighlightMain(false)
    setBidTarget(null)
    setBidDemoAuto(null)
    seenPujaIds.current.clear()

    mainChatRef.current?.reset()
    setIsSubscribed(false)
    setUser(null)
    setActiveChat('main')
    setMobileShowChat(true)

    const setStep = (n) => setDemoProgress({ current: n, total: 6, label: DEMO_STEPS[n - 1] })

    setStep(1)
    await mainChatRef.current?.simulateAction('🔓 Comprar ganado')
    await delay(800)

    setStep(2)
    await mainChatRef.current?.simulateAction('✅ Ya pagué')
    await delay(1000)

    setStep(3)
    await mainChatRef.current?.simulateAction('📢 Entrar al canal')
    await delay(1200)

    const subasta = getDemoSubasta()
    const baseOffer = Number(subasta?.mejor_oferta) || 8200000
    const userOffer = baseOffer + 200000

    setStep(4)
    setActiveChat('canal')
    await delay(600)
    await runDemoBid(subasta, userOffer)

    setStep(5)
    await delay(800)
    const competitorOffer = userOffer + 600000
    setCanalPreview(`Frigorífico El Rebaño · ${formatCOP(competitorOffer)}`)
    appendCanalMessage(
      'demo-puja-competitor',
      `🔔 *NUEVA PUJA* — Frigorífico El Rebaño sube a ${formatCOP(competitorOffer)}`
    )
    await updateSubasta(
      { mejor_oferta: competitorOffer, mejor_ofertante: 'Frigorífico El Rebaño' },
      { silent: true }
    )
    await delay(2200)

    setStep(6)
    appendCanalMessage(
      'demo-cerrada',
      `🔨 *¡LOTE #AC-2024-047 ADJUDICADO!*
━━━━━━━━━━━━━━━
🏆 Ganador: Frigorífico El Rebaño
💰 Precio final: ${formatCOP(competitorOffer)}
📋 Guía ICA en proceso
✅ Coordinando transporte`
    )
    setCanalPreview('LOTE ADJUDICADO ✓')
    await updateSubasta(
      { mejor_oferta: competitorOffer, mejor_ofertante: 'Frigorífico El Rebaño', estado: 'cerrada' },
      { silent: true }
    )
    setLoteClosed(true)
    setShowConfetti(true)

    demoRunningRef.current = false
    setDemoRunning(false)
    setTimeout(() => {
      setDemoProgress(null)
      setShowConfetti(false)
    }, 4500)
  }

  function handleSelectChat(id) {
    setActiveChat(id)
    setMobileShowChat(true)
  }

  function renderChat() {
    if (activeChat === 'main') {
      return (
        <AgroconectaMainChat
          ref={mainChatRef}
          onSubscribed={activateSubscription}
          onSwitchToCanal={() => {
            setActiveChat('canal')
            setMobileShowChat(true)
          }}
        />
      )
    }

    return (
      <CanalSubastasChat
        activeSubastas={activeSubastas}
        liveMessages={liveMessages}
        loteClosed={loteClosed}
        onBid={requestBid}
        isSubscribed={isSubscribed}
        loading={initialLoading}
        useFallback={useFallback}
      />
    )
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
          userName={isSubscribed ? user?.name : null}
          highlightMain={highlightMain}
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

        {demoProgress && (
          <div className="fixed top-4 right-4 z-30 bg-white rounded-xl shadow-lg p-4 w-64">
            <p className="text-xs text-[#667781] mb-1">
              {demoProgress.current}/{demoProgress.total}
            </p>
            <p className="text-sm font-medium text-[#075E54] mb-2">{demoProgress.label}</p>
            <div className="h-1.5 bg-[#E9EDEF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#25D366] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(demoProgress.current / demoProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <ConfettiOverlay active={showConfetti} />
      </div>

      {bidTarget && isSubscribed && (
        <BidModal
          subasta={activeSubastas.find((s) => s.id === bidTarget.id) ?? bidTarget}
          buyerName={user?.name ?? USER_IDENTITY.name}
          onClose={() => {
            setBidTarget(null)
            setBidDemoAuto(null)
          }}
          onSubmit={handleBid}
          demoAuto={bidDemoAuto}
        />
      )}
    </div>
  )
}
