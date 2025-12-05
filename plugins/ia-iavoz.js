import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  const prompt = `Como C.C. de Code Geass, responde breve a: ${text}`
  
  // Intento 1: DeepSeek API (gratis)
  try {
    const aiRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50
      })
    })
    
    const aiData = await aiRes.json()
    const respuesta = aiData.choices[0].message.content
    
    // TTS
    const ttsUrl = `https://translate.google.com/translate_tts?tl=es&q=${encodeURIComponent(respuesta)}`
    const vozRes = await fetch(ttsUrl)
    const audio = await vozRes.arrayBuffer()
    
    await conn.sendMessage(m.chat, { 
      audio: Buffer.from(audio), 
      mimetype: 'audio/mpeg' 
    }, { quoted: m })
    
  } catch (e) {
    // Si falla, enviar solo TTS del texto original
    const ttsUrl = `https://translate.google.com/translate_tts?tl=es&q=${encodeURIComponent(text)}`
    const vozRes = await fetch(ttsUrl)
    const audio = await vozRes.arrayBuffer()
    
    await conn.sendMessage(m.chat, { 
      audio: Buffer.from(audio), 
      mimetype: 'audio/mpeg' 
    }, { quoted: m })
  }
}

handler.command = ['cc']
export default handler
