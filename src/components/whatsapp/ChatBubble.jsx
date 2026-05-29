import { CheckCheck } from 'lucide-react'

export function renderWhatsAppText(text) {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={i}>{part.slice(1, -1)}</strong>
    }
    return part
  })
}

export function SystemMessage({ children }) {
  return (
    <div className="flex justify-center my-3 px-4">
      <span className="bg-[#FFF3CD]/90 text-[#54656F] text-xs px-3 py-1.5 rounded-lg shadow-sm text-center max-w-sm leading-relaxed">
        {children}
      </span>
    </div>
  )
}

export default function ChatBubble({ type = 'received', text, time, isLast = false }) {
  if (type === 'system') {
    return <SystemMessage>{text}</SystemMessage>
  }

  const isSent = type === 'sent'

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-1 px-3 md:px-6`}>
      <div
        className={`relative max-w-[85%] md:max-w-[65%] px-3 py-2 pb-5 shadow-sm ${
          isSent
            ? 'bg-[#DCF8C6] rounded-lg rounded-tr-none'
            : 'bg-white rounded-lg rounded-tl-none'
        }`}
      >
        <p className="text-sm text-[#111B21] whitespace-pre-wrap leading-relaxed pr-2">
          {renderWhatsAppText(text)}
        </p>
        <div className="absolute bottom-1 right-2 flex items-center gap-1">
          <span className="text-[10px] text-[#667781]">{time}</span>
          {isSent && <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" strokeWidth={2.5} />}
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2 px-3 md:px-6">
      <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
        <span className="typing-dot w-2 h-2 bg-[#90949c] rounded-full" />
        <span className="typing-dot w-2 h-2 bg-[#90949c] rounded-full" />
        <span className="typing-dot w-2 h-2 bg-[#90949c] rounded-full" />
      </div>
    </div>
  )
}
