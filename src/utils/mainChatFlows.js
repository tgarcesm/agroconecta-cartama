export const MAIN_BUTTONS = [
  '🐄 Vender mi ganado',
  '🔓 Comprar ganado',
  '💰 Ver precios',
  '❓ Cómo funciona',
]

export const WELCOME_MESSAGE = `¡Bienvenido a Agroconecta Cartama! 🐄
*Tradición ganadera, conexión moderna.*

Conectamos ganaderos y compradores de la Provincia Cartama 
de forma directa, sin intermediarios.

¿Qué quieres hacer hoy?`

export const USER_IDENTITY = { id: 'user', name: 'Usuario' }

const FLOWS = {
  '🐄 Vender mi ganado': {
    text: `¡Perfecto! Para publicar tu lote necesitás la suscripción 📋

*SUSCRIPCIÓN — $25.000/mes*
✅ Publicación de lotes en subasta
✅ Verificación en finca por nuestro equipo
✅ Gestión de guía ICA incluida
✅ Acceso también al canal de compras

Pagá por Nequi al 300-555-0199 o Bancolombia
Cuando confirmés el pago te agendamos la visita 🤝`,
    buttons: ['✅ Ya pagué', '❓ Más info'],
    typingMs: 1500,
  },
  '🔓 Comprar ganado': {
    text: `Para acceder al canal de subastas verificadas 🔑

*SUSCRIPCIÓN — $25.000/mes*
✅ Acceso a lotes verificados en finca
✅ Pujas ilimitadas
✅ Ganado local = menos flete y merma
✅ Podés también publicar tu propio ganado

Es la misma suscripción para vender y comprar 🤝

Pagá por Nequi al 300-555-0199`,
    buttons: ['✅ Ya pagué', '🐄 Ver lotes activos'],
    typingMs: 1500,
  },
  '🔓 Suscribirme para pujar': {
    text: `Para acceder al canal de subastas verificadas 🔑

*SUSCRIPCIÓN — $25.000/mes*
✅ Acceso a lotes verificados en finca
✅ Pujas ilimitadas
✅ Ganado local = menos flete y merma
✅ Podés también publicar tu propio ganado

Es la misma suscripción para vender y comprar 🤝

Pagá por Nequi al 300-555-0199`,
    buttons: ['✅ Ya pagué', '🐄 Ver lotes activos'],
    typingMs: 1500,
  },
  '💰 Ver precios': {
    text: `Precios de referencia esta semana 📈

🏆 Feria de Medellín: *$11.034/kg*
📍 Cencogán: $10.800/kg
📍 Subastas Cartama: $9.100/kg

Con Agroconecta varios compradores compiten por tu ganado y obtenés el mejor precio del mercado 💪`,
    buttons: ['🐄 Vender mi ganado', '📢 Ver canal'],
    typingMs: 1500,
  },
  '❓ Cómo funciona': {
    text: `Así funciona Agroconecta 👇

*Para vender:*
1️⃣ Te suscribís ($25.000/mes)
2️⃣ Publicás tu lote con fotos
3️⃣ Verificamos en tu finca
4️⃣ Subasta abierta — varios compradores pujan
5️⃣ Ganás la mejor oferta 🏆

*Para comprar:*
1️⃣ Misma suscripción
2️⃣ Accedés al canal
3️⃣ Pujás en lotes verificados
4️⃣ Coordinamos el transporte 🚛

Una sola suscripción para los dos lados 🤝`,
    buttons: ['🐄 Vender mi ganado', '🔓 Comprar ganado'],
    typingMs: 1500,
  },
  '❓ Más info': {
    text: `Así funciona Agroconecta 👇

*Para vender:*
1️⃣ Te suscribís ($25.000/mes)
2️⃣ Publicás tu lote con fotos
3️⃣ Verificamos en tu finca
4️⃣ Subasta abierta — varios compradores pujan
5️⃣ Ganás la mejor oferta 🏆

*Para comprar:*
1️⃣ Misma suscripción
2️⃣ Accedés al canal
3️⃣ Pujás en lotes verificados
4️⃣ Coordinamos el transporte 🚛

Una sola suscripción para los dos lados 🤝`,
    buttons: ['🐄 Vender mi ganado', '🔓 Comprar ganado'],
    typingMs: 1500,
  },
  '🐄 Ver lotes activos': {
    text: `Lotes activos ahora mismo 🐄

*Lote #AC-047* — Támesis
12 novillos · Brahman x Angus · 420kg
Mejor oferta: $8.200.000 ⏱ 4h

*Lote #AC-046* — Valparaíso
8 novillas · Simmental · 280kg
Mejor oferta: $5.900.000 ⏱ 11h`,
    buttons: ['🔓 Suscribirme para pujar', '📢 Ver canal'],
    typingMs: 1500,
  },
  '✅ Ya pagué': {
    text: `¡Listo, acceso activado! 🎉

Ya podés vender tu ganado y pujar en el canal de subastas.

Hay *2 subastas activas* ahora mismo 🔴`,
    buttons: ['📢 Entrar al canal', '🐄 Publicar mi lote'],
    typingMs: 2000,
    confirmSubscription: true,
  },
  '🐄 Publicar mi lote': {
    text: 'Contame sobre tu ganado 👇\n¿Cuántos animales? ¿Qué raza? ¿Municipio?',
    buttons: [],
    typingMs: 1500,
    awaitingLoteInfo: true,
  },
}

const SWITCH_TO_CANAL = ['📢 Entrar al canal', '📢 Ver canal', '📢 Ver el canal de subastas']

export function shouldSwitchToCanal(label) {
  return SWITCH_TO_CANAL.includes(label)
}

export function resolveMainChatAction(label, { awaitingLoteInfo } = {}) {
  if (FLOWS[label]) return FLOWS[label]

  if (shouldSwitchToCanal(label)) {
    return { switchToCanal: true, typingMs: 0 }
  }

  return null
}

export function resolveFreeText(text, { awaitingLoteInfo } = {}) {
  const lower = text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

  if (/hola|buenos|buenas/.test(lower)) {
    return {
      text: WELCOME_MESSAGE,
      buttons: MAIN_BUTTONS,
      typingMs: 1500,
    }
  }

  if (awaitingLoteInfo) {
    return {
      text: 'Recibido 📝 Te agendamos la visita de verificación esta semana.\nCarlos Mendoza irá a tu finca y publicamos el lote en subasta ✅',
      buttons: ['📢 Ver el canal de subastas'],
      typingMs: 1500,
      clearAwaitingLoteInfo: true,
    }
  }

  if (/pague|ya pague|transferi|listo/.test(lower)) {
    return FLOWS['✅ Ya pagué']
  }

  return {
    text: 'Entendido 🤝 ¿Te ayudo con algo más?',
    buttons: MAIN_BUTTONS,
    typingMs: 1500,
  }
}
