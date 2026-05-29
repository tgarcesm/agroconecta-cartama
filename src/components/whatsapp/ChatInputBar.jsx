import { Smile, Mic } from 'lucide-react'

export default function ChatInputBar({ notice }) {
  return (
    <div className="shrink-0 bg-[#F0F2F5]">
      {notice && (
        <p className="text-center text-xs text-[#667781] py-2 px-4 bg-[#FFF8E1] border-t border-[#FFE082]">
          {notice}
        </p>
      )}
      <div className="flex items-center gap-2 px-3 py-2">
        <button type="button" className="text-[#54656F] p-2">
          <Smile className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-white rounded-lg px-4 py-2.5">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="w-full text-sm outline-none text-[#111B21] placeholder:text-[#667781]"
            readOnly
          />
        </div>
        <button type="button" className="text-[#54656F] p-2">
          <Mic className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
