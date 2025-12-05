import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Escribe algo')
  
  // API de Google TTS (gratis, sin límites)
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es&q=${encodeURIComponent(text)}`
  
  try {
    const res = await fetch(url)
    const audioBuffer = await res.arrayBuffer()
    
    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg'
    }, { quoted: m })
    
  } catch (e) {
    m.reply('Error')
  }
}

handler.help = ['iavoz <texto>']
handler.tags = ['ia']
handler.command = ['iavoz']
export default handler
