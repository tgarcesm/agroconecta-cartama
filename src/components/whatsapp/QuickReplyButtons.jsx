export default function QuickReplyButtons({ options, onSelect, disabled = false, highlightedLabel = null }) {
  if (!options?.length) return null

  return (
    <div className="flex flex-wrap gap-2 px-3 md:px-6 mb-3 justify-end">
      {options.map((label) => (
        <button
          key={label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(label)}
          className={`text-xs bg-white border rounded-full px-3 py-2 font-medium shadow-sm disabled:opacity-50 transition-all duration-300 ${
            highlightedLabel === label
              ? 'border-[#25D366] bg-[#E7F8EF] ring-2 ring-[#25D366]/50 scale-105'
              : 'border-[#075E54]/40 text-[#075E54] hover:bg-[#E7F8EF]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
