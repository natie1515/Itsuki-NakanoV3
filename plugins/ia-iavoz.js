import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🧀 *Escribe algo*')
  
  const key = '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'
  
  // 1. Groq IA (funciona)
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system', 
        content: 'Eres C.C. de Code Geass. Responde breve como ella, habla de contratos y Lelouch.'
      }, {
        role: 'user',
        content: text
      }],
      max_tokens: 40
    })
  })
  
  const data = await res.json()
  
  if (data.error) {
    return m.reply(`Error IA: ${data.error.message}`)
  }
  
  const respuesta = data.choices[0].message.content
  
  // 2. ENVIAR SOLO TEXTO (no hay TTS gratis que funcione)
  await conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  🧀 C.C. RESPONDE ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> ${respuesta}

"Los contratos a veces son solo palabras."`, m)
}

handler.command = ['cc']
export default handler
