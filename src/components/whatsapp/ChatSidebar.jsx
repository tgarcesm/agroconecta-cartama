import { Search } from 'lucide-react'
import { CONVERSATIONS } from '../../constants/whatsapp'

export default function ChatSidebar({ activeId, onSelect, hidden = false, canalPreview, buyer, onChangeBuyer }) {
  return (
    <aside
      className={`${hidden ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-[350px] shrink-0 border-r border-[#E9EDEF] bg-white h-full`}
    >
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between shrink-0">
        <span className="text-white font-medium text-sm">Chats</span>
      </div>

      <div className="px-3 py-2 bg-[#F0F2F5] shrink-0">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-[#667781] shrink-0" />
          <input
            type="text"
            placeholder="Buscar chat..."
            className="flex-1 text-sm bg-transparent outline-none text-[#111B21] placeholder:text-[#667781]"
            readOnly
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {CONVERSATIONS.map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => onSelect(chat.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#F5F6F6] transition-colors text-left border-b border-[#F0F2F5] ${
              activeId === chat.id ? 'bg-[#F0F2F5]' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#DFE5E7] flex items-center justify-center text-xl shrink-0">
              {chat.name.split(' ')[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-[#111B21] text-sm truncate">{chat.name}</span>
                <span className="text-[11px] text-[#667781] shrink-0">{chat.timestamp}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-xs text-[#667781] truncate">
                  {chat.id === 'canal' && canalPreview ? canalPreview : chat.lastMessage}
                </span>
                {chat.unread > 0 && (
                  <span className="bg-[#25D366] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-[#E9EDEF] p-3 shrink-0 bg-[#F0F2F5]">
        {buyer ? (
          <button
            type="button"
            onClick={onChangeBuyer}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors"
          >
            <p className="text-[10px] text-[#667781] uppercase tracking-wide">Comprando como</p>
            <p className="text-sm font-medium text-[#075E54] truncate">
              {buyer.emoji} {buyer.name}
            </p>
            <p className="text-[10px] text-[#667781]">Tocar para cambiar</p>
          </button>
        ) : (
          <button
            type="button"
            onClick={onChangeBuyer}
            className="w-full bg-[#075E54] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#064E46]"
          >
            👤 Entrar como comprador
          </button>
        )}
      </div>
    </aside>
  )
}
