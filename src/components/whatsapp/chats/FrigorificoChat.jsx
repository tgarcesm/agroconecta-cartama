import ChatBubble from '../ChatBubble'
import ChatInputBar from '../ChatInputBar'

const MESSAGES = [
  { type: 'received', text: 'Buenos días, somos Frigorífico El Rebaño. ¿Tienen lotes disponibles para esta semana?', time: '08:45' },
  { type: 'sent', text: '¡Buenos días! Sí, tenemos 2 subastas activas hoy en Támesis y Valparaíso 🐄', time: '08:47' },
  { type: 'sent', text: 'Puede ver los lotes en el Canal Subastas y hacer ofertas directamente. Todo verificado en finca ✅', time: '08:47' },
  { type: 'received', text: 'Perfecto. ¿Hay lotes disponibles mañana?', time: '09:10' },
  { type: 'sent', text: 'Mañana se publican 3 lotes nuevos después de las verificaciones de campo. Le avisamos por el canal 📢', time: '09:12' },
  { type: 'received', text: 'Listo, estamos atentos. Gracias', time: '09:15' },
]

export default function FrigorificoChat() {
  return (
    <>
      <div className="flex-1 overflow-y-auto whatsapp-bg py-3">
        {MESSAGES.map((msg, i) => (
          <ChatBubble key={i} type={msg.type} text={msg.text} time={msg.time} />
        ))}
      </div>
      <ChatInputBar />
    </>
  )
}
