import { useEffect, useState } from 'react'
import { getCountdown } from '../../utils/format'

export default function CountdownTimer({ fechaCierre }) {
  const [remaining, setRemaining] = useState(() => getCountdown(fechaCierre))

  useEffect(() => {
    setRemaining(getCountdown(fechaCierre))
    const interval = setInterval(() => {
      setRemaining(getCountdown(fechaCierre))
    }, 1000)
    return () => clearInterval(interval)
  }, [fechaCierre])

  return <span className="font-mono text-sm">{remaining}</span>
}
