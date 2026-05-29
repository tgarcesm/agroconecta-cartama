import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BUYER_IDENTITIES } from '../../constants/compradores'

export default function IdentitySelector({ selected, onSelect, onEnter }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-primary text-center mb-2">¿Quién eres?</h2>
        <p className="text-gray-500 text-sm text-center mb-6">Selecciona tu perfil de comprador</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {BUYER_IDENTITIES.map((identity) => {
            const isSelected = selected?.id === identity.id
            return (
              <button
                key={identity.id}
                type="button"
                onClick={() => onSelect(identity)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl">{identity.emoji}</span>
                <div>
                  <p className="font-semibold text-primary text-sm leading-tight">{identity.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{identity.municipio}</p>
                </div>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          disabled={!selected}
          onClick={onEnter}
          className="w-full bg-primary text-background font-medium py-3 rounded-lg hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Entrar como comprador →
        </button>
      </div>
    </div>
  )
}
