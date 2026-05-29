import { Link } from 'react-router-dom'

const VARIANTS = {
  full: 'h-40 sm:h-48 md:h-56 w-auto max-w-[min(100%,260px)]',
  sidebar: 'h-14 w-auto max-w-[130px]',
  nav: 'h-9 w-auto max-w-[120px]',
  icon: 'h-9 w-9 rounded-full object-cover object-top',
}

const FRAME_STYLES = {
  full: 'rounded-2xl px-8 py-6 sm:px-10 sm:py-7 shadow-2xl ring-1 ring-black/5',
  sidebar: 'rounded-xl px-4 py-3 shadow-md ring-1 ring-white/40',
  nav: 'rounded-lg px-3 py-1.5 shadow-sm ring-1 ring-black/5',
  icon: 'rounded-full p-0.5 shadow-sm ring-2 ring-white/35',
}

/** Variantes que van sobre fondo verde oscuro → marco crema automático */
const AUTO_FRAME = new Set(['full', 'sidebar'])

export default function Logo({
  variant = 'nav',
  className = '',
  linkTo = null,
  framed = null,
  title = 'Agroconecta Cartama',
}) {
  const useFrame = framed ?? AUTO_FRAME.has(variant)

  const img = (
    <img
      src="/logo.png"
      alt={title}
      className={`${VARIANTS[variant] ?? VARIANTS.nav} block mx-auto ${className}`.trim()}
      draggable={false}
    />
  )

  const inner = useFrame ? (
    <span
      className={`inline-flex items-center justify-center bg-background ${FRAME_STYLES[variant] ?? FRAME_STYLES.sidebar}`}
    >
      {img}
    </span>
  ) : (
    img
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex shrink-0 items-center" aria-label={title}>
        {inner}
      </Link>
    )
  }

  return inner
}
