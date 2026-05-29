import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ChatBubble, { TypingIndicator } from '../ChatBubble'
import ChatInputBar from '../ChatInputBar'
import QuickReplyButtons from '../QuickReplyButtons'
import {
  WELCOME_MESSAGE,
  MAIN_BUTTONS,
  resolveMainChatAction,
  resolveFreeText,
  shouldSwitchToCanal,
} from '../../../utils/mainChatFlows'

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const AgroconectaMainChat = forwardRef(function AgroconectaMainChat(
  { onSubscribed, onSwitchToCanal },
  ref
) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'received',
      text: WELCOME_MESSAGE,
      time: formatTime(),
    },
  ])
  const [quickButtons, setQuickButtons] = useState(MAIN_BUTTONS)
  const [typing, setTyping] = useState(false)
  const [busy, setBusy] = useState(false)
  const [awaitingLoteInfo, setAwaitingLoteInfo] = useState(false)
  const [highlightedButton, setHighlightedButton] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, quickButtons])

  function reset() {
    setMessages([
      { id: 'welcome', type: 'received', text: WELCOME_MESSAGE, time: formatTime() },
    ])
    setQuickButtons(MAIN_BUTTONS)
    setTyping(false)
    setBusy(false)
    setAwaitingLoteInfo(false)
    setHighlightedButton(null)
  }

  async function respond(result, userLabel) {
    if (!result) return

    if (result.switchToCanal) {
      onSwitchToCanal?.()
      return
    }

    setTyping(true)
    setBusy(true)
    await delay(result.typingMs ?? 1500)
    setTyping(false)

    setMessages((prev) => [
      ...prev,
      {
        id: `reply-${Date.now()}`,
        type: 'received',
        text: result.text,
        time: formatTime(),
      },
    ])

    setQuickButtons(result.buttons ?? MAIN_BUTTONS)

    if (result.awaitingLoteInfo) setAwaitingLoteInfo(true)
    if (result.clearAwaitingLoteInfo) setAwaitingLoteInfo(false)

    if (result.confirmSubscription) onSubscribed?.()

    if (shouldSwitchToCanal(userLabel)) {
      await delay(600)
      onSwitchToCanal?.()
    }

    setBusy(false)
  }

  async function handleAction(label, { showUserBubble = true, simulateTap = false } = {}) {
    if (busy && !simulateTap) return

    if (simulateTap) {
      setHighlightedButton(label)
      await delay(450)
    }

    if (showUserBubble) {
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, type: 'sent', text: label, time: formatTime() },
      ])
      setQuickButtons([])
    }

    setHighlightedButton(null)

    if (shouldSwitchToCanal(label)) {
      onSwitchToCanal?.()
      return
    }

    const result = resolveMainChatAction(label, { awaitingLoteInfo })
    await respond(result, label)
  }

  async function handleFreeText(text) {
    if (busy) return

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: 'sent', text, time: formatTime() },
    ])
    setQuickButtons([])

    const result = resolveFreeText(text, { awaitingLoteInfo })
    await respond(result, text)
  }

  useImperativeHandle(ref, () => ({
    reset,
    simulateAction(label) {
      return handleAction(label, { simulateTap: true })
    },
  }))

  return (
    <>
      <div className="flex-1 overflow-y-auto whatsapp-bg py-3">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} type={msg.type} text={msg.text} time={msg.time} />
        ))}
        {typing && (
          <div className="px-3 md:px-6 mb-2">
            <p className="text-xs text-[#667781] mb-1">Agroconecta está escribiendo...</p>
            <TypingIndicator />
          </div>
        )}
        <QuickReplyButtons
          options={quickButtons}
          onSelect={handleAction}
          disabled={busy}
          highlightedLabel={highlightedButton}
        />
        <div ref={bottomRef} />
      </div>
      <ChatInputBar onSend={handleFreeText} disabled={busy} />
    </>
  )
})

export default AgroconectaMainChat
