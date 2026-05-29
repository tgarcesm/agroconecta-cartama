export default function ConfettiOverlay({ active }) {
  if (!active) return null

  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 2}s`,
    color: i % 2 === 0 ? '#1E4D2B' : '#8B6914',
    size: 6 + Math.random() * 8,
  }))

  return (
    <div className="confetti-container pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  )
}
