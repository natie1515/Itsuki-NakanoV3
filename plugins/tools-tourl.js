// ⓘ Sistema de Almacenamiento Imperial - Adaptado para el Imperio de Britannia

import fetch, { FormData, Blob } from 'node-fetch'
import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'
import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys'

// ⓘ Configuración estratégica - El conocimiento es poder
const GITHUB_HARDCODED_TOKEN = process.env.GITHUB_TOKEN || ''
const GITHUB_HARDCODED_REPO = process.env.GITHUB_REPO || 'WillZek/Storage-CB2'

async function makeFkontak() {
  try {
    const res = await fetch('https://files.catbox.moe/jem7nf.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { locationMessage: { name: 'Sistema de Archivos Imperial', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return null
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`
}

// ⓘ Protocolos de subida - Cada uno con su propósito estratégico
async function uploadGitHub(filename, base64Content) {
  const token = process.env.GITHUB_TOKEN || global.GITHUB_TOKEN || GITHUB_HARDCODED_TOKEN
  const repo = process.env.GITHUB_REPO || global.GITHUB_REPO || GITHUB_HARDCODED_REPO
  if (!token) throw new Error('ⓘ `Token de GitHub no configurado. La seguridad requiere credenciales.`')
  const path = `images/${filename}`
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'upload-bot' },
    body: JSON.stringify({ message: `upload ${filename}`, content: base64Content })
  })
  const data = await res.json()
  if (data?.content?.download_url) return data.content.download_url
  throw new Error(data?.message || 'ⓘ `Fallo en la operación de subida a GitHub. Recalcular estrategia.`')
}

async function uploadCatbox(buffer, ext, mime) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  const randomBytes = crypto.randomBytes(5).toString('hex')
  form.append('fileToUpload', new Blob([buffer], { type: mime || 'application/octet-stream' }), `${randomBytes}.${ext || 'bin'}`)
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  return (await res.text()).trim()
}

async function uploadPostImages(buffer, ext, mime) {
  const form = new FormData()
  form.append('optsize', '0')
  form.append('expire', '0')
  form.append('numfiles', '1')
  form.append('upload_session', String(Math.random()))
  form.append('file', new Blob([buffer], { type: mime || 'image/jpeg' }), `${Date.now()}.${ext || 'jpg'}`)
  const res = await fetch('https://postimages.org/json/rr', { method: 'POST', body: form })
  const json = await res.json().catch(async () => ({ raw: await res.text() }))
  return json?.url || json?.images?.[0]?.url || null
}

async function uploadLitterbox(buffer, ext, mime) {
  const form = new FormData()
  form.append('file', new Blob([buffer], { type: mime || 'application/octet-stream' }), `upload.${ext || 'bin'}`)
  form.append('time', '24h')
  const res = await fetch('https://api.alvianuxio.eu.org/uploader/litterbox', { method: 'POST', body: form })
  const text = await res.text()
  try { const j = JSON.parse(text); return j.url || j.data?.url || null } catch { return /https?:\/\/[\w./-]+/i.test(text) ? text.trim() : null }
}

async function uploadTmpFiles(buffer, ext, mime) {
  const form = new FormData()
  form.append('file', new Blob([buffer], { type: mime || 'application/octet-stream' }), `upload.${ext || 'bin'}`)
  const res = await fetch('https://api.alvianuxio.eu.org/uploader/tmpfiles', { method: 'POST', body: form })
  const text = await res.text()
  try { const j = JSON.parse(text); return j.url || j.data?.url || j.link || null } catch { return /https?:\/\/[\w./-]+/i.test(text) ? text.trim() : null }
}

async function uploadFreeImageHost(buffer, ext, mime) {
  const form = new FormData()
  form.append('key', '6d207e02198a847aa98d0a2a901485a5')
  form.append('action', 'upload')
  form.append('source', new Blob([buffer], { type: mime || 'image/jpeg' }), `upload.${ext || 'jpg'}`)
  const res = await fetch('https://freeimage.host/api/1/upload', { method: 'POST', body: form })
  const j = await res.json().catch(async () => ({ raw: await res.text() }))
  return j?.image?.url || j?.data?.image?.url || null
}

async function uploadServiceByName(name, buffer, ext, mime) {
  switch ((name || '').toLowerCase()) {
    case 'github': {
      const fname = `${crypto.randomBytes(6).toString('hex')}.${ext || 'bin'}`
      const content = Buffer.from(buffer).toString('base64')
      return await uploadGitHub(fname, content)
    }
    case 'catbox': return await uploadCatbox(buffer, ext, mime)
    case 'postimages': return await uploadPostImages(buffer, ext, mime)
    case 'litterbox': return await uploadLitterbox(buffer, ext, mime)
    case 'tmpfiles': return await uploadTmpFiles(buffer, ext, mime)
    case 'freeimagehost': return await uploadFreeImageHost(buffer, ext, mime)
    default: throw new Error('ⓘ `Servicio no reconocido. Revisa tus opciones estratégicas.`')
  }
}

// ⓘ Servicios disponibles - Cada uno tiene su función en el plan
const SERVICE_LIST = [
  { key: 'github', label: 'ⓘ `Archivo Permanente Imperial`', description: 'Almacenamiento estratégico a largo plazo' },
  { key: 'catbox', label: 'ⓘ `Depósito Rápido`', description: 'Transferencia inmediata de recursos' },
  { key: 'postimages', label: 'ⓘ `Galería de Inteligencia`', description: 'Visualización y análisis de imágenes' },
  { key: 'litterbox', label: 'ⓘ `Almacén Temporal (24h)`', description: 'Información de corta duración' },
  { key: 'tmpfiles', label: 'ⓘ `Documentos de Misión`', description: 'Archivos operativos temporales' },
  { key: 'freeimagehost', label: 'ⓘ `Hosting Público`', description: 'Distribución masiva de contenido' },
  { key: 'all', label: 'ⓘ `Protocolo de Saturación`', description: 'Todos los servicios simultáneamente' }
]

async function sendChooser(m, conn, usedPrefix) {
  let fkontak = await makeFkontak()
  if (!fkontak) fkontak = m
  try {
    const avatarUrl = 'https://files.catbox.moe/jem7nf.jpg'
    const device = await getDevice(m.key.id)
    if (device !== 'desktop' && device !== 'web') {
      const media = await prepareWAMessageMedia({ image: { url: avatarUrl } }, { upload: conn.waUploadToServer })
      const rows = SERVICE_LIST.map(s => ({ 
        header: s.label, 
        title: 'Sistema de Archivos Imperial', 
        description: s.description, 
        id: `${usedPrefix}tourl ${s.key}` 
      }))
      const interactiveMessage = {
        body: { text: 'ⓘ `Selecciona el protocolo de subida imperial:`' },
        footer: { text: 'ⓘ `Cada elección afecta la estrategia final. Elige con precisión.`' },
        header: { title: 'SISTEMA DE ARCHIVOS IMPERIAL', hasMediaAttachment: true, imageMessage: media.imageMessage },
        nativeFlowMessage: { 
          buttons: [ { 
            name: 'single_select', 
            buttonParamsJson: JSON.stringify({ 
              title: 'Protocolos Disponibles', 
              sections: [ { 
                title: 'ⓘ `Opciones Estratégicas`', 
                rows 
              } ] 
            }) 
          } ], 
          messageParamsJson: '' 
        }
      }
      const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.jid, quoted: fkontak })
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
      return true
    }
  } catch {}
  const list = SERVICE_LIST.map(s => `ⓘ \`${usedPrefix}tourl ${s.key}\` - ${s.description}`).join('\n')
  await conn.sendMessage(m.chat, { 
    text: `ⓘ \`SISTEMA DE SUBIDA IMPERIAL\` 📁\n\n` +
          `ⓘ \`Selecciona un protocolo:\`\n\n` +
          `${list}\n\n` +
          `ⓘ \`La elección correcta maximiza la eficiencia operativa.\`` 
  }, { quoted: fkontak })
  return true
}

const tourSessions = new Map()

async function doUpload(m, conn, serviceKey) {
  const sessKey = m.chat + ':' + m.sender
  let fromCache = tourSessions.get(sessKey)
  let buffer, mime
  
  if (fromCache && fromCache.buffer) {
    buffer = fromCache.buffer
    mime = fromCache.mime || ''
  } else {
    const q = m.quoted ? (m.quoted.msg || m.quoted) : m
    mime = (q.mimetype || q.mediaType || q.mtype || '').toString().toLowerCase()
    
    if (!/image|video|audio|sticker|document/.test(mime)) {
      await conn.reply(m.chat, 
        `ⓘ \`ARCHIVO NO COMPATIBLE\` ⚠️\n\n` +
        `ⓘ \`Responde a una imagen, video, audio, sticker o documento.\`\n` +
        `ⓘ \`Solo archivos estratégicos son procesados por el sistema.\``, 
        m
      )
      return true
    }
    
    buffer = await q.download()
  }
  
  if (!buffer || !buffer.length) { 
    await conn.reply(m.chat, 
      `ⓘ \`FALLO EN DESCARGA\` ❌\n\n` +
      `ⓘ \`No se pudo obtener el archivo del objetivo.\`\n` +
      `ⓘ \`Verifica la integridad del recurso e intenta nuevamente.\``, 
      m
    )
    return true 
  }
  
  const sizeBytes = buffer.length
  if (sizeBytes > 1024 * 1024 * 1024) { 
    await conn.reply(m.chat, 
      `ⓘ \`ARCHIVO DEMASIADO GRANDE\` 🚫\n\n` +
      `ⓘ \`El archivo supera 1GB de capacidad.\`\n` +
      `ⓘ \`Límite estratégico: 1GB por operación.\``, 
      m
    )
    return true 
  }
  
  const humanSize = formatBytes(sizeBytes)
  const typeInfo = await fileTypeFromBuffer(buffer) || {}
  const { ext, mime: realMime } = typeInfo

  let results = []
  
  // ⓘ Protocolo de saturación - Todos los servicios
  if ((serviceKey || '').toLowerCase() === 'all') {
    for (const svc of SERVICE_LIST.filter(s => s.key !== 'all')) {
      try {
        const url = await uploadServiceByName(svc.key, buffer, ext, realMime)
        if (url) results.push({ name: svc.label, url, size: humanSize })
      } catch {
        // ⓘ Fallo silencioso - Parte de la estrategia
      }
    }
  } else {
    // ⓘ Protocolo específico
    const pick = SERVICE_LIST.find(s => s.key === (serviceKey || '').toLowerCase())
    if (!pick) { 
      await conn.reply(m.chat, 
        `ⓘ \`PROTOCOLO INVÁLIDO\` ❌\n\n` +
        `ⓘ \`Servicio no reconocido por el sistema imperial.\`\n` +
        `ⓘ \`Usa ${usedPrefix}tourl para ver opciones disponibles.\``, 
        m
      )
      return true 
    }
    
    try {
      const url = await uploadServiceByName(pick.key, buffer, ext, realMime)
      if (url) results.push({ name: pick.label, url, size: humanSize })
    } catch (e) { 
      await conn.reply(m.chat, 
        `ⓘ \`ERROR ESTRATÉGICO\` ⚠️\n\n` +
        `ⓘ \`Fallo en protocolo ${pick.label}:\`\n` +
        `ⓘ \`${e.message}\`\n\n` +
        `ⓘ \`Recalculando opciones alternativas.\``, 
        m
      )
      return true 
    }
  }

  if (!results.length) { 
    await conn.reply(m.chat, 
      `ⓘ \`OPERACIÓN FALLIDA\` ❌\n\n` +
      `ⓘ \`No se generaron enlaces de acceso.\`\n` +
      `ⓘ \`Todos los protocolos reportaron fallos. Revisar conexión.\``, 
      m
    )
    return true 
  }

  let txt = `ⓘ \`OPERACIÓN DE SUBIDA COMPLETADA\` ✅\n\n`
  for (const r of results) {
    txt += `${r.name}\n`
    txt += `ⓘ \`Enlace de acceso:\` ${r.url}\n`
    txt += `ⓘ \`Tamaño del recurso:\` ${r.size}\n\n`
  }
  txt += `ⓘ \`Todos los enlaces generados según el plan. Recursos disponibles para distribución.\` 📁`

  let fkontak = await makeFkontak()
  if (!fkontak) fkontak = m

  let mediaHeader = null
  try {
    if (/image/.test(mime)) mediaHeader = await prepareWAMessageMedia({ image: buffer }, { upload: conn.waUploadToServer })
  } catch {}

  const buttons = results.map(r => ({ 
    name: 'cta_copy', 
    buttonParamsJson: JSON.stringify({ 
      display_text: `ⓘ Copiar ${r.name.split('`')[1] || 'Enlace'}`, 
      copy_code: r.url 
    }) 
  }))
  
  const interactiveMessage = {
    body: { text: txt },
    footer: { text: 'ⓘ Selecciona un botón para copiar el enlace estratégico.' },
    header: { title: 'ENLACES IMPERIALES GENERADOS', hasMediaAttachment: !!mediaHeader?.imageMessage, imageMessage: mediaHeader?.imageMessage },
    nativeFlowMessage: { buttons, messageParamsJson: '' }
  }
  
  const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.jid, quoted: fkontak })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  
  try { tourSessions.delete(sessKey) } catch {}
  return true
}

let handler = async (m, { conn, args, usedPrefix }) => {
  const service = (args[0] || '').toLowerCase()
  
  if (!service) {
    // ⓘ Fase de reconocimiento - Identificar el recurso objetivo
    const q = m.quoted ? (m.quoted.msg || m.quoted) : m
    const mime = (q.mimetype || q.mediaType || q.mtype || '').toString().toLowerCase()
    
    if (!/image|video|audio|sticker|document/.test(mime)) {
      await conn.reply(m.chat, 
        `ⓘ \`RECONOCIMIENTO FALLIDO\` 🔍\n\n` +
        `ⓘ \`Responde a un archivo compatible:\`\n` +
        `ⓘ \`Imagen / Video / Audio / Sticker / Documento\`\n\n` +
        `ⓘ \`El sistema solo procesa recursos estratégicos.\``, 
        m
      )
      return true
    }
    
    const buffer = await q.download()
    if (!buffer || !buffer.length) { 
      await conn.reply(m.chat, 
        `ⓘ \`ERROR EN ADQUISICIÓN\` ⚠️\n\n` +
        `ⓘ \`No se pudo obtener el recurso del objetivo.\`\n` +
        `ⓘ \`Verifica la disponibilidad e intenta nuevamente.\``, 
        m
      )
      return true 
    }
    
    // ⓘ Almacenamiento temporal para planificación
    const sessKey = m.chat + ':' + m.sender
    tourSessions.set(sessKey, { buffer, mime, ts: Date.now() })
    
    return sendChooser(m, conn, usedPrefix)
  }
  
  // ⓘ Ejecutar protocolo seleccionado
  return doUpload(m, conn, service)
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl|upload|subirimagen|archivoimperial)$/i

handler.before = async function (m, { conn, usedPrefix }) {
  try {
    const msg = m.message || {}
    let selectedId = null
    const irm = msg.interactiveResponseMessage
    if (!selectedId && irm?.nativeFlowResponseMessage) {
      try {
        const params = JSON.parse(irm.nativeFlowResponseMessage.paramsJson || '{}')
        if (typeof params.id === 'string') selectedId = params.id
        if (!selectedId && typeof params.selectedId === 'string') selectedId = params.selectedId
        if (!selectedId && typeof params.rowId === 'string') selectedId = params.rowId
      } catch {}
    }
    const lrm = msg.listResponseMessage
    if (!selectedId && lrm?.singleSelectReply?.selectedRowId) selectedId = lrm.singleSelectReply.selectedRowId
    const brm = msg.buttonsResponseMessage
    if (!selectedId && brm?.selectedButtonId) selectedId = brm.selectedButtonId
    if (!selectedId) return false

    const mTourl = /\btourl\b\s+(github|catbox|postimages|litterbox|tmpfiles|freeimagehost|all)/i.exec(selectedId)
    if (mTourl) {
      return await doUpload(m, conn, mTourl[1].toLowerCase())
    }
    return false
  } catch { 
    return false 
  }
}

export default handler
