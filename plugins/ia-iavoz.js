import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  // Texto de C.C. directo (sin IA por ahora)
  const frase = `Soy C.C. ${text} ¿Quieres hacer un contrato?`
  
  // URL segura para TTS
  const url = `https://api.dubdub.ai/tts?text=${encodeURIComponent(frase)}&voice=espeaka`
  
  const res = await fetch(url)
  const audio = await res.arrayBuffer()
  
  await conn.sendMessage(m.chat, {
    audio: Buffer.from(audio),
    mimetype: 'audio/mp4'
  }, { quoted: m })
}

handler.command = ['cc']
export default handler
