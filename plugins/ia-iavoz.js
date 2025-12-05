import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, text }) => {
  // Texto directo
  const respuesta = `Soy C.C. ${text}`
  
  // 1. Primero envía el texto
  await m.reply(respuesta)
  
  // 2. Si hay función toAudio, envía audio
  if (toAudio) {
    const audio = await toAudio(respuesta, 'mp3')
    await conn.sendMessage(m.chat, {
      audio: audio,
      mimetype: 'audio/mpeg'
    }, { quoted: m })
  }
}

handler.command = ['cc']
export default handler
