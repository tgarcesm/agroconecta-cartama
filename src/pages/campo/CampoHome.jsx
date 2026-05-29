import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const STATIC_COMPLETED = [
  {
    id: 'static-1',
    ganaderoNombre: 'Don Hernando Ruiz',
    municipio: 'La Pintada',
    descripcion: 'Lote #038 — 25 novillos',
    raza: 'Brahman',
    distancia: '~12 km',
    estado: 'activa',
  },
  {
    id: 'static-2',
    ganaderoNombre: 'Finca El Roble',
    municipio: 'Valparaíso',
    descripcion: 'Lote #031 — 18 hembras',
    raza: 'Angus',
    distancia: '~8 km',
    estado: 'activa',
  },
]

const STATS = [
  { label: 'Verificaciones hoy', value: 3 },
  { label: 'Completadas', value: 1 },
  { label: 'Pendientes', value: 2 },
]

function VisitBadge({ verified }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
        ✓ Verificada
      </span>
    )
  }
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
      Pendiente
    </span>
  )
}

function VisitCard({ visit, onStart, staticCompleted = false }) {
  const verified = staticCompleted || visit.estado === 'activa'
  const borderColor = verified ? 'border-l-green-500' : 'border-l-yellow-400'

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${borderColor} p-4 md:p-5 md:flex md:items-center md:gap-6`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
          <h3 className="font-bold text-primary">{visit.ganaderoNombre}</h3>
          <span className="md:hidden">
            <VisitBadge verified={verified} />
          </span>
        </div>

        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
          {visit.municipio}
        </p>

        <p className="text-sm text-gray-700">
          {visit.descripcion ?? visit.lote ?? 'Lote ganadero'}
          {visit.raza ? ` · ${visit.raza}` : ''}
        </p>

        <p className="text-xs text-gray-400 mt-1 md:hidden">{visit.distancia ?? '~15 km'}</p>
      </div>

      <div className="md:flex md:items-center md:gap-4 md:shrink-0 mt-3 md:mt-0">
        <span className="hidden md:inline-flex">
          <VisitBadge verified={verified} />
        </span>
        {!verified && onStart && (
          <button
            type="button"
            onClick={() => onStart(visit)}
            className="w-full md:w-auto bg-primary hover:bg-primary-light text-background font-medium py-2.5 md:py-2 px-5 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            Iniciar verificación →
          </button>
        )}
      </div>
    </div>
  )
}

function WeekSummary() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-5 h-fit">
      <h3 className="text-lg font-semibold text-primary">Resumen de la semana</h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Verificaciones completadas</p>
          <p className="text-3xl font-bold text-primary mt-1">12</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Lotes publicados</p>
          <p className="text-3xl font-bold text-primary mt-1">4</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Municipios visitados</p>
          <p className="text-base font-medium text-primary mt-1">Támesis, Valparaíso</p>
        </div>
      </div>

      <div className="bg-primary/10 rounded-xl h-36 flex items-center justify-center border border-primary/20">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-2 opacity-60" />
          <p className="text-sm font-medium text-primary">Zona asignada</p>
          <p className="text-xs text-gray-500 mt-0.5">Támesis · Valparaíso</p>
        </div>
      </div>
    </div>
  )
}

export default function CampoHome({ onStartVerification }) {
  const [subastas, setSubastas] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchVisitas() {
    const { data, error } = await supabase
      .from('subastas')
      .select('*, ganaderos(nombre)')
      .in('estado', ['pendiente_verificacion', 'activa'])
      .order('created_at', { ascending: false })

    if (!error && data) {
      setSubastas(
        data.map((s) => ({
          ...s,
          ganaderoNombre: s.ganaderos?.nombre ?? 'Sin nombre',
          descripcion: s.lote ?? s.descripcion,
        }))
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVisitas()

    const channel = supabase
      .channel('campo-verificaciones')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'verificaciones' }, fetchVisitas)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subastas' }, fetchVisitas)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const visitList = (
    <>
      {loading ? (
        <p className="text-gray-400 text-sm text-center py-6">Cargando visitas…</p>
      ) : (
        <div className="space-y-3">
          {subastas.map((visit) => (
            <VisitCard key={visit.id} visit={visit} onStart={onStartVerification} />
          ))}
          {STATIC_COMPLETED.map((visit) => (
            <VisitCard key={visit.id} visit={visit} staticCompleted />
          ))}
          {subastas.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">No hay visitas pendientes en Supabase</p>
          )}
        </div>
      )}
    </>
  )

  return (
    <div className="space-y-5 md:space-y-6 pb-8 animate-fade-in">
      {/* Greeting — mobile stacked, desktop inline */}
      <div className="bg-primary rounded-2xl p-5 md:p-6 text-background">
        <div className="md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h1 className="text-lg md:text-xl font-bold">
              <span className="md:hidden block mb-1">Bienvenido, Carlos Mendoza</span>
              <span className="hidden md:inline">Bienvenido, Carlos Mendoza · </span>
              <span className="hidden md:inline capitalize font-normal text-background/90">{today}</span>
            </h1>
            <p className="text-background/70 text-sm capitalize mb-2 md:hidden">{today}</p>
            <p className="text-accent text-sm italic">Visitador de Campo · Támesis & Valparaíso</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 md:mt-0 md:flex md:gap-6 md:shrink-0">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 md:bg-white/15 rounded-xl px-3 py-2 md:px-5 md:py-3 text-center md:min-w-[100px]"
              >
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-background/70 leading-tight mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visits — mobile single column, desktop two columns */}
      <div className="md:grid md:grid-cols-5 md:gap-6">
        <div className="md:col-span-3">
          <h2 className="text-base md:text-lg font-semibold text-primary mb-3 md:mb-4">
            <span className="md:hidden">Visitas de Hoy</span>
            <span className="hidden md:inline">Visitas Pendientes Hoy</span>
          </h2>
          {visitList}
        </div>

        <div className="hidden md:block md:col-span-2">
          <WeekSummary />
        </div>
      </div>
    </div>
  )
}
