import { BUYER_IDENTITIES } from '../../constants/compradores'

export default function BuyerIdentityModal({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl overflow-hidden animate-fade-in">
        <div className="bg-[#075E54] px-5 py-4">
          <h2 className="text-white font-semibold text-lg">¿Quién eres?</h2>
          <p className="text-white/70 text-sm">Elige tu perfil de comprador para pujar</p>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {BUYER_IDENTITIES.map((identity) => (
            <button
              key={identity.id}
              type="button"
              onClick={() => {
                onSelect(identity)
                onClose()
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#E9EDEF] hover:border-[#075E54] hover:bg-[#F0F2F5] transition-all text-left"
            >
              <span className="text-2xl">{identity.emoji}</span>
              <div>
                <p className="font-medium text-[#111B21] text-sm">{identity.name}</p>
                <p className="text-xs text-[#667781]">{identity.municipio}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-sm text-[#667781] hover:text-[#111B21]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
