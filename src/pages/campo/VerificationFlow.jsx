import { useState } from 'react'
import { Camera, Play, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const VISITADOR = 'Carlos Mendoza'
const EDAD_OPTIONS = ['12-18 meses', '18-24 meses', '24-36 meses', '+36 meses']

const STEPS = [
  { num: 1, title: 'Datos del Lote', desc: 'Información del ganado' },
  { num: 2, title: 'Registro Visual', desc: 'Fotos y video' },
  { num: 3, title: 'Ficha Técnica', desc: 'Documento oficial' },
  { num: 4, title: 'Confirmar', desc: 'Publicar subasta' },
]

const PHOTO_SLOTS = [
  { id: 'frontal', label: 'Foto frontal' },
  { id: 'lateral', label: 'Foto lateral' },
  { id: 'grupo', label: 'Grupo completo' },
  { id: 'detalle', label: 'Detalle' },
]

function StepIndicatorMobile({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 md:hidden">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step === current
                ? 'bg-primary text-background scale-110'
                : step < current
                  ? 'bg-primary-light text-background'
                  : 'bg-gray-200 text-gray-400'
            }`}
          >
            {step}
          </div>
          {step < 4 && <span className="text-gray-300 text-xs">·</span>}
        </div>
      ))}
    </div>
  )
}

function StepSidebarDesktop({ current }) {
  return (
    <div className="hidden md:block bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Progreso de verificación
      </h3>
      <ol className="space-y-4">
        {STEPS.map(({ num, title, desc }) => {
          const done = num < current
          const active = num === current
          return (
            <li key={num} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  done
                    ? 'bg-primary text-background'
                    : active
                      ? 'bg-primary-light text-background ring-2 ring-primary/30'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? <Check className="w-4 h-4" strokeWidth={3} /> : num}
              </div>
              <div>
                <p className={`text-sm font-medium ${active ? 'text-primary' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                  {title}
                </p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function SuccessScreen({ ganaderoNombre, onFinish }) {
  return (
    <div className="flex items-center justify-center py-8 md:py-16 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="success-checkmark mb-6 flex justify-center">
          <div className="check-icon">
            <Check className="w-10 h-10 text-background" strokeWidth={3} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-primary mb-3">¡Lote verificado y publicado!</h2>
        <p className="text-gray-600 text-sm mb-2">
          El lote de <strong>{ganaderoNombre}</strong> ya está activo en el canal de subastas
        </p>
        <p className="text-gray-500 text-sm mb-8">Los compradores pueden pujar ahora</p>
        <button
          type="button"
          onClick={onFinish}
          className="w-full bg-primary text-background font-medium py-3 rounded-lg hover:bg-primary-light transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default function VerificationFlow({ subasta, onComplete }) {
  const [step, setStep] = useState(1)
  const [fade, setFade] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    cantidad: subasta.cantidad_animales ?? subasta.cantidad ?? '',
    peso: subasta.peso_estimado ?? '',
    raza: subasta.raza ?? '',
    edad: '18-24 meses',
    estadoSanitario: 'Bueno',
    observaciones: '',
    listoSubasta: true,
  })

  const [photos, setPhotos] = useState({})
  const [videoChecked, setVideoChecked] = useState(false)

  const fichaNum = `AC-${Math.floor(1000 + Math.random() * 9000)}`
  const now = new Date().toLocaleString('es-CO')
  const photosCount = Object.values(photos).filter(Boolean).length
  const ganaderoNombre = subasta.ganaderoNombre ?? subasta.ganaderos?.nombre ?? 'el ganadero'

  function goToStep(next) {
    setFade(false)
    setTimeout(() => {
      setStep(next)
      setFade(true)
    }, 200)
  }

  async function handlePublish() {
    setSubmitting(true)
    const fechaCierre = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    await supabase.from('verificaciones').insert({
      subasta_id: subasta.id,
      visitador: VISITADOR,
      peso_real: Number(form.peso) || null,
      estado_sanitario: form.estadoSanitario,
      completada: true,
    })

    await supabase
      .from('subastas')
      .update({ estado: 'activa', fecha_cierre: fechaCierre })
      .eq('id', subasta.id)

    setSubmitting(false)
    setSuccess(true)
  }

  if (success) {
    return <SuccessScreen ganaderoNombre={ganaderoNombre} onFinish={onComplete} />
  }

  const inputClass =
    'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30'
  const btnPrimary =
    'bg-primary text-background font-medium py-3 px-6 rounded-lg hover:bg-primary-light transition-colors'

  const stepContent = (
    <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-primary">Datos del Lote</h2>
            <p className="text-sm text-gray-500 mt-1">Confirma o ajusta la información del lote</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm space-y-2 text-sm">
            <p><span className="text-gray-500">Ganadero:</span> <strong>{ganaderoNombre}</strong></p>
            <p><span className="text-gray-500">Municipio:</span> {subasta.municipio}</p>
            <p><span className="text-gray-500">Descripción:</span> {subasta.descripcion ?? subasta.lote ?? '—'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cantidad real</label>
              <input type="number" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Peso promedio real (kg)</label>
              <input type="number" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Raza</label>
              <input type="text" value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Edad promedio</label>
              <select value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })} className={inputClass}>
                {EDAD_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <button type="button" onClick={() => goToStep(2)} className={`w-full md:w-auto ${btnPrimary}`}>
            Siguiente →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-primary">Registro Visual</h2>
            <p className="text-sm text-gray-600 mt-1">Captura evidencia del lote</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {PHOTO_SLOTS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPhotos({ ...photos, [id]: !photos[id] })}
                className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                  photos[id] ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'
                }`}
              >
                {photos[id] ? (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-background" />
                  </div>
                ) : (
                  <Camera className="w-8 h-8 text-gray-300" />
                )}
                <span className="text-xs text-gray-500 text-center px-2">{label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setVideoChecked(!videoChecked)}
            className={`w-full py-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 transition-all ${
              videoChecked ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
            }`}
          >
            {videoChecked ? (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-background" />
              </div>
            ) : (
              <Play className="w-6 h-6 text-gray-300" />
            )}
            <span className="text-sm text-gray-600">Video del lote (30 seg)</span>
          </button>

          <p className="text-xs text-gray-400">Mínimo 3 fotos requeridas ({photosCount}/4)</p>

          <button type="button" disabled={photosCount < 3} onClick={() => goToStep(3)} className={`w-full md:w-auto ${btnPrimary} disabled:opacity-40 disabled:cursor-not-allowed`}>
            Siguiente →
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-primary">Ficha Técnica</h2>
            <p className="text-sm text-gray-600 mt-1">Vista previa de ficha técnica</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-sm">
              <div className="bg-primary px-4 py-3 text-center">
                <p className="text-background font-bold text-xs tracking-widest">AGROCONECTA CARTAMA</p>
                <p className="text-background/80 text-[10px] mt-0.5">FICHA TÉCNICA DE VERIFICACIÓN</p>
              </div>
              <div className="p-4 md:p-5 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-gray-500">Número de ficha</span><span className="font-mono font-bold text-primary">{fichaNum}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Fecha y hora</span><span>{now}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Visitador</span><span>{VISITADOR}</span></div>
                <hr className="border-gray-100 my-2" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-gray-500">Ganadero</span><span className="font-medium">{ganaderoNombre}</span>
                  <span className="text-gray-500">Municipio</span><span>{subasta.municipio}</span>
                  <span className="text-gray-500">Cantidad</span><span>{form.cantidad}</span>
                  <span className="text-gray-500">Peso prom.</span><span>{form.peso} kg</span>
                  <span className="text-gray-500">Raza</span><span>{form.raza}</span>
                  <span className="text-gray-500">Edad prom.</span><span>{form.edad}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Estado sanitario</label>
                <select value={form.estadoSanitario} onChange={(e) => setForm({ ...form, estadoSanitario: e.target.value })} className={inputClass}>
                  <option value="Bueno">Bueno ✓</option>
                  <option value="Regular">Regular ⚠</option>
                  <option value="Requiere revisión">Requiere revisión ✗</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Observaciones</label>
                <textarea rows={4} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className={`${inputClass} resize-none`} placeholder="Notas adicionales…" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.listoSubasta} onChange={(e) => setForm({ ...form, listoSubasta: e.target.checked })} className="w-4 h-4 accent-primary" />
                Listo para subasta
              </label>
            </div>
          </div>

          <button type="button" onClick={() => goToStep(4)} className={`w-full md:w-auto ${btnPrimary}`}>
            Siguiente →
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-primary">Confirmar y Publicar</h2>
            <p className="text-sm text-gray-500 mt-1">Revisa el resumen antes de publicar</p>
          </div>

          <div className="bg-white rounded-xl border border-primary/20 shadow-sm p-5 md:p-6 space-y-3 text-sm max-w-2xl">
            <h3 className="font-bold text-primary border-b border-gray-100 pb-2">Resumen de verificación</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-xs md:text-sm">
              <span className="text-gray-500">Ganadero</span><span className="font-medium col-span-1">{ganaderoNombre}</span>
              <span className="text-gray-500">Municipio</span><span>{subasta.municipio}</span>
              <span className="text-gray-500">Cantidad</span><span>{form.cantidad} animales</span>
              <span className="text-gray-500">Peso promedio</span><span>{form.peso} kg</span>
              <span className="text-gray-500">Raza</span><span>{form.raza}</span>
              <span className="text-gray-500">Edad</span><span>{form.edad}</span>
              <span className="text-gray-500">Estado sanitario</span><span>{form.estadoSanitario}</span>
              <span className="text-gray-500">Fotos</span><span>{photosCount} capturadas</span>
              <span className="text-gray-500">Ficha</span><span className="font-mono">{fichaNum}</span>
            </div>
            {form.observaciones && (
              <p className="text-xs text-gray-600 pt-2 border-t border-gray-100">
                <span className="text-gray-500">Observaciones:</span> {form.observaciones}
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handlePublish}
            className={`w-full md:w-auto ${btnPrimary} py-4 disabled:opacity-50`}
          >
            {submitting ? 'Publicando…' : '✓ Marcar como verificado y publicar en subasta'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="pb-8 md:pb-0">
      <StepIndicatorMobile current={step} />

      <div className="md:grid md:grid-cols-5 md:gap-8">
        <div className="md:col-span-2">
          <StepSidebarDesktop current={step} />
        </div>
        <div className="md:col-span-3 px-4 md:px-0">
          {stepContent}
        </div>
      </div>
    </div>
  )
}
