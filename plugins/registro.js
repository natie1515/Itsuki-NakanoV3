import { saveDatabase } from '../lib/db.js'
import { buildUserRecord, sendRegisterCard, sendExistingIdCard } from '../lib/registry.js'
import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const sessions = new Map()
const regRecent = new Map() // registro reciente

function toNum(jid = '') { return String(jid).split('@')[0].split(':')[0].replace(/[^0-9]/g, '') }

function mirrorUser(users, numKey, jidKey) {
  if (!users) return
  const a = users[numKey]
  const b = users[jidKey]
  const ref = a || b
  if (!ref) return
  users[numKey] = ref
  users[jidKey] = ref
}

async function askStep(m, conn, step) {
  const prompts = {
    name: 'Indica tu nombre para el registro:',
    age: 'Indica tu edad (10-90 años):',
    bio: 'Escribe una breve descripción de ti (máx 80 caracteres):'
  }
  await conn.reply(m.chat, prompts[step], m)
}

async function finalize(m, conn, state, userKey, isOwner = false) {
  const num = toNum(m.sender)
  const jidKey = m.sender

  try { regRecent.set(m.sender, Date.now()) } catch {}
  global.db.data.users ||= {}
  global.db.data.users[num] ||= { exp: 0, coin: 10, level: 0, warns: 0, premium: false, spam: 0 }
  const base = global.db.data.users[num]
  const record = buildUserRecord(base, state)
  Object.assign(global.db.data.users[num], record, { registered: true })
  try { mirrorUser(global.db.data.users, num, jidKey) } catch {}
  try { global.db.data.users[jidKey].registered = true } catch {}
  try { await saveDatabase() } catch (e) { console.log('[DB] save error:', e?.message || e) }

  let avatarUrl = ''
  try { avatarUrl = await conn.profilePictureUrl(m.sender, 'image') } catch {}
  if (!avatarUrl) avatarUrl = 'https://files.catbox.moe/xr2m6u.jpg'

  const userTag = '@' + num
  let autoName = m?.pushName || ''
  try { autoName = (await Promise.resolve(conn.getName?.(m.sender))) || autoName } catch {}
  if (!autoName) autoName = 'Usuario'

  let quoted = null
  try {
    const res = await fetch('https://i.postimg.cc/QCzMhBR1/1757986334220.png')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    quoted = {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { locationMessage: { name: 'Registro Completado', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {}

  await sendRegisterCard(conn, m.chat, { userTag, avatarUrl, info: record, participant: m.sender, userName: autoName, title: 'Registro', quoted })

  if (isOwner) {
    await conn.reply(m.chat, `Registro completado. La operación ha sido ejecutada bajo su mandato.`, m)
  }
}

let handler = async (m, { conn, args, command, usedPrefix, isOwner }) => {
  const chatId = m.chat
  const userId = m.sender
  const key = chatId + ':' + userId
  const isCancel = /^cancel(ar)?$/i.test(args[0] || '')

  // Inicio registro
  if (/^reg(istro)?$/i.test(command)) {
    const num = toNum(m.sender)
    const jidKey = m.sender
    const users = (global.db && global.db.data && global.db.data.users) ? global.db.data.users : {}
    try { mirrorUser(users, num, jidKey) } catch {}
    const existing = users[num] || users[jidKey]

    if (existing && (existing.registered || existing.sn)) {
      const last = regRecent.get(m.sender) || 0
      if (Date.now() - last < 3000) return
      if (!existing.sn) existing.sn = 'SN-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000)
      try { await saveDatabase() } catch {}

      let displayName = m?.pushName || ''
      try { displayName = (await Promise.resolve(conn.getName?.(m.sender))) || displayName } catch {}
      if (!displayName) displayName = 'Usuario'

      if (isOwner) {
        await conn.reply(m.chat, `Registro ya existente. Su orden se ha cumplido.`, m)
      }

      await sendExistingIdCard(conn, m.chat, { participant: m.sender, userName: displayName, existing })
      return
    }

    let autoName = m?.pushName || ''
    try { autoName = (await Promise.resolve(conn.getName?.(m.sender))) || autoName } catch {}
    if (!autoName) autoName = 'Usuario'

    const fkontak = m // fallback

    // Edad rápida 17..30
    const minAge = 17, maxAge = 30
    const rows = []
    for (let i = minAge; i <= maxAge; i++) {
      rows.push({ header: `Edad ${i}`, title: autoName, description: 'Seleccionar esta edad', id: `${usedPrefix}regok ${i}` })
    }

    await conn.sendMessage(m.chat, { text: `Registro rápido\nNombre detectado: ${autoName}\nSeleccione su edad entre ${minAge}-${maxAge}` }, { quoted: fkontak })
    return
  }

  // Cancelar
  if (isCancel) {
    if (sessions.has(key)) { sessions.delete(key); await conn.reply(m.chat, 'Registro cancelado.', m) }
    else await conn.reply(m.chat, 'No hay registro en curso.', m)
    return
  }

  // Confirmación de edad
  if (/^regok$/i.test(command)) {
    const age = parseInt(args[0])
    if (isNaN(age) || age < 10 || age > 90) {
      await conn.reply(m.chat, 'Edad inválida. Ejemplo: .regok 20', m)
      return
    }
    let autoName = m?.pushName || ''
    try { autoName = (await Promise.resolve(conn.getName?.(m.sender))) || autoName } catch {}
    if (!autoName) autoName = 'Usuario'
    const state = { name: autoName, age, bio: 'Sin descripción' }
    try { regRecent.set(m.sender, Date.now()) } catch {}
    sessions.delete(key)

    return finalize(m, conn, state, key, isOwner)
  }
}

handler.help = ['registro', 'reg', 'regok <edad>', 'cancel']
handler.tags = ['user']
handler.command = /^(registro|reg|regok|cancel)$/i

export default handler
