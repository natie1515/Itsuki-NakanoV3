import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🧀 *Escribe algo*')

  // API de IA REAL (FlowGPT - funciona)
  const prompt = `Como C.C. de Code Geass, responde a esto breve: "${text}"`
  
  try {
    const aiRes = await fetch('https://flowgpt.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo'
      })
    })
    
    const aiData = await aiRes.json()
    const respuesta = aiData.choices[0].message.content || `¿${text}? Interesante propuesta.`
    
    // Google TTS
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es&q=${encodeURIComponent(respuesta)}`
    
    await conn.sendMessage(m.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mpeg'
    }, { quoted: m })
    
  } catch (e) {
    // Si falla, respuesta predefinida
    const respuestas = [
      `¿${text}? Hablemos de contratos.`,
      `Lelouch consideraría tu propuesta: ${text}`,
      `Como inmortal, he oído muchas cosas. ${text} es una más.`
    ]
    
    const fallback = respuestas[Math.floor(Math.random() * respuestas.length)]
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es&q=${encodeURIComponent(fallback)}`
    
    await conn.sendMessage(m.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mpeg'
    }, { quoted: m })
  }
}

handler.command = ['cc']
export default handler
