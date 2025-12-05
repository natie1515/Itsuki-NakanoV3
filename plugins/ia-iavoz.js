import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Escribe algo')
  
  const key = ''
  
  // Petición MÍNIMA a Groq
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
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
  
  const voz = `https://translate.google.com/translate_tts?tl=es&q=${encodeURIComponent(respuesta)}`
  
  await conn.sendMessage(m.chat, {
    audio: { url: voz },
    mimetype: 'audio/mpeg'
  }, { quoted: m })
}

handler.command = ['cc']
export default handler
