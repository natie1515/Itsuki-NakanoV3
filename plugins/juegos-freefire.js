import axios from 'axios'

async function fetchUid(u) {
  const url = `https://gameskinbo.com/api/free_fire_id_checker?uid=${encodeURIComponent(u)}`
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
    },
    timeout: 15000
  })
  const text = typeof res.data === 'string' ? res.data : (res.data?.text || '')
  return text
}

function parseText(raw, givenUid) {
  const lines = (raw || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const items = []
  const data = {}
  for (const line of lines) {
    const cleaned = line.replace(/^[-*`>\s]+/g, '')
    const m = cleaned.match(/^([^:]{2,40}):\s*(.+)$/)
    if (!m) continue
    const label = m[1].trim()
    const value = m[2].trim().replace(/^`|`$/g,'')
    items.push({ label, value })
    const key = label.toLowerCase()
    if (key === 'uid') data.uid = value
    else if (key === 'name') data.name = value
    else if (key === 'level') {
      data.levelRaw = value
      const lv = value.match(/(\d+)/); if (lv) data.level = parseInt(lv[1])
      const exp = value.match(/Exp\s*:\s*(\d+)/i); if (exp) data.exp = parseInt(exp[1])
    } else if (key === 'region') data.region = value
    else data[label] = value
  }
  data.uid = data.uid || givenUid
  data.bannerImage = data.uid ? `https://gameskinbo.com/_next/image?url=%2Fapi%2Fbanner%2Fbanner_${data.uid}.webp&w=1080&q=75` : null
  return { lines, items, data }
}

let handler = async (m, { text, args, usedPrefix, command, conn }) => {
  const rawText = (text || args.join(' ') || '').trim()
  const uid = (rawText.match(/\b\d{5,}\b/) || [null])[0]
  
  if (!uid) {
    await conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTRUCCIONES ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

*Protocolo de consulta de estratega*
Formato: ${usedPrefix + command} <uid>
Ejemplo: ${usedPrefix + command} 12183392680

"Conocer al enemigo es el primer paso hacia la victoria."`, m)
    return
  }

  await m.react?.('⏳')
  let raw
  try {
    raw = await fetchUid(uid)
    if (!raw) throw new Error('Respuesta vacía')
  } catch (e) {
    await m.react?.('✖️')
    await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ CONEXIÓN FALLIDA ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

*No pudo obtenerse información del estratega UID ${uid}*
Causa: ${e.message || 'Error de conexión'}

"Hasta el mejor espía puede fallar en obtener información."`, m)
    return
  }

  const parsed = parseText(raw, uid)
  const f = parsed.data
  const now = new Date()
  const fechaLocal = now.toLocaleString('es-ES', { hour12: false })

  const coreLines = []
  if (f.name) coreLines.push(`Estratega: *${f.name}*`)
  if (f.uid) coreLines.push(`Identificación: *${f.uid}*`)
  if (typeof f.level !== 'undefined' || f.levelRaw) {
    const lvlTxt = typeof f.level !== 'undefined' ? f.level : f.levelRaw
    coreLines.push(`Rango de Batalla: *${lvlTxt}*${f.exp ? `   Experiencia: *${f.exp}*` : ''}`)
  }
  if (f.region) coreLines.push(`Territorio: *${f.region}*`)

  const skipKeys = new Set(['uid','name','level','levelraw','exp','region','bannerImage'])
  const extraLines = []
  for (const { label, value } of parsed.items) {
    const k = label.toLowerCase()
    if (skipKeys.has(k)) continue
    extraLines.push(`   ${label}: *${value}*`)
  }

  const caption = [
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ PERFIL DE ESTRATEGA ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`,
`${coreLines.join('\n')}`,
extraLines.length ? `\n*Registro de Batallas:*` : '',
...extraLines,
`\n⏰ Consulta realizada: ${fechaLocal}`,
`\n"El valor de un guerrero se mide en su historial de batallas."`
  ].filter(Boolean).join('\n')

  try {
    if (f.bannerImage) {
      await conn.sendMessage(m.chat, { 
        image: { url: f.bannerImage }, 
        caption 
      }, { quoted: m })
    } else {
      await conn.reply(m.chat, caption, m)
    }
    await m.react?.('👑')
  } catch (e) {
    await m.react?.('✖️')
    await conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ TRANSMISIÓN FALLIDA ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

*Información obtenida pero transmisión fallida*
${caption}
\nError: ${e.message}`, m)
  }
}

handler.help = ['free <uid>']
handler.tags = ['game']
handler.command = ['free','freefire','ffid','free_fire','ff']

export default handler
