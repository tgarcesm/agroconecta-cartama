import ChatBubble from '../ChatBubble'
import ChatInputBar from '../ChatInputBar'

const MESSAGES = [
  { type: 'received', text: 'Buenas tardes, me dijeron que acá puedo vender mi ganado', time: '09:12' },
  { type: 'sent', text: '¡Buenas Don Hernando! Así es, somos Agroconecta Cartama 🤝 Le cuento cómo funciona...', time: '09:13' },
  { type: 'sent', text: 'Usted nos envía fotos y datos de su lote, nosotros vamos a la finca a verificar, y publicamos en subasta. Varios compradores pujan y usted recibe la mejor oferta 💰', time: '09:13' },
  { type: 'received', text: '¿Y cuánto cobran?', time: '09:15' },
  { type: 'sent', text: '$25.000 al mes de suscripción y 1.5% sobre el valor del lote que se venda. Si no vende, no paga comisión 👍', time: '09:16' },
  { type: 'received', text: '¿Y cómo sé que el precio es bueno?', time: '09:18' },
  { type: 'sent', text: 'Porque varios compradores compiten entre sí. La semana pasada un lote salió en $7.8M y se adjudicó en $9.1M 📈', time: '09:19' },
  { type: 'received', text: 'Bueno, me anoto. Tengo 12 novillos listos', time: '09:22' },
  { type: 'sent', text: '¡Perfecto! Le agendo una visita de verificación. ¿Cuándo le queda bien esta semana? 📅', time: '09:23' },
  { type: 'received', text: 'El jueves en la mañana está bien', time: '09:25' },
  { type: 'sent', text: 'Listo Don Hernando, el jueves a las 8am va Carlos Mendoza a su finca ✅', time: '09:26' },
  { type: 'received', text: 'Gracias, muy buena experiencia 🙏', time: '10:32' },
]

export default function DonHernandoChat() {
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
