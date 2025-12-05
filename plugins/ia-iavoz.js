import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Escribe algo')
  
  const key = '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'
  
  // 1. Groq IA
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: text }],
      max_tokens: 20
    })
  })
  
  console.log('Status:', res.status)
  const data = await res.json()
  console.log('Response:', data)
  
  if (data.error) {
    m.reply(`Error API: ${data.error.message}`)
    return
  }
  
  const respuesta = data.choices?.[0]?.message?.content || '...'
  console.log('Respuesta IA:', respuesta)
  
  // 2. TTS ALTERNATIVO (no Google)
  const ttsUrl = `http://api.voicerss.org/?key=demo&hl=es-es&src=${encodeURIComponent(respuesta)}`
  
  try {
    await conn.sendMessage(m.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mpeg'
    }, { quoted: m })
  } catch (ttsError) {
    // Si falla TTS, enviar solo texto
    m.reply(`*C.C. dice:* ${respuesta}\n\n(Audio no disponible)`)
  }
}

handler.command = ['cc']
export default handler
