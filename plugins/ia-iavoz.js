let handler = async (m, { conn, text }) => {
  const audio = await conn.sendAudio(m.chat, 
    `https://translate.google.com/translate_tts?tl=es&q=${encodeURIComponent(text)}`,
    m, 
    'voz.mp3'
  )
}

handler.command = ['cc']
export default handler
