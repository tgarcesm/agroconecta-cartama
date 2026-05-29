import { Smile, Mic, Send } from 'lucide-react'
import { useState } from 'react'

export default function ChatInputBar({
  notice,
  onSend,
  disabled = false,
  placeholder = 'Escribe un mensaje...',
}) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || !onSend || disabled) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="shrink-0 bg-[#F0F2F5]">
      {notice && (
        <p className="text-center text-xs text-[#667781] py-2 px-4 bg-[#FFF8E1] border-t border-[#FFE082]">
          {notice}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2">
        <button type="button" className="text-[#54656F] p-2">
          <Smile className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-white rounded-lg px-4 py-2.5 flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || !onSend}
            className="w-full text-sm outline-none text-[#111B21] placeholder:text-[#667781] disabled:opacity-50"
          />
        </div>
        {onSend ? (
          <button
            type="submit"
            disabled={!text.trim() || disabled}
            className="text-[#075E54] p-2 disabled:opacity-40"
          >
            <Send className="w-6 h-6" />
          </button>
        ) : (
          <button type="button" className="text-[#54656F] p-2">
            <Mic className="w-6 h-6" />
          </button>
        )}
      </form>
    </div>
  )
}
