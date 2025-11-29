import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  try {
    if (!args[0]) {
      return conn.reply(m.chat,
        `> ⓘ USO INCORRECTO

> ❌ Debes proporcionar un enlace de Facebook

> 📝 Ejemplos:
> • ${usedPrefix + command} https://fb.watch/xxxxx
> • ${usedPrefix}fb https://facebook.com/xxxxx

> 💡 Comandos:
> • ${usedPrefix}fb <url> - Descargar video
> • ${usedPrefix}fbaudio <url> - Extraer audio`, m)
    }

    const url = args[0]
    if (!url.match(/facebook\.com|fb\.watch/)) {
      return conn.reply(m.chat,
        `> ⓘ ENLACE INVALIDO

> ❌ URL no válida

> 💡 Ejemplo correcto:
> https://fb.watch/xxxxx
> https://facebook.com/xxxxx`, m)
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

    const apiUrl = `https://mayapi.ooguy.com/facebook?url=${encodeURIComponent(url)}&apikey=may-f53d1d49`
    const response = await fetch(apiUrl, {
      timeout: 30000
    })

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data = await response.json()

    if (!data.status) {
      throw new Error('La API no respondió correctamente')
    }

    let videoUrl, videoTitle

    if (data.result && data.result.url) {
      videoUrl = data.result.url
      videoTitle = data.result.title || 'Video de Facebook'
    } else if (data.url) {
      videoUrl = data.url
      videoTitle = data.title || 'Video de Facebook'
    } else if (data.data && data.data.url) {
      videoUrl = data.data.url
      videoTitle = data.data.title || 'Video de Facebook'
    } else {
      throw new Error('No se encontró URL del video')
    }

    const isAudioCommand = command.toLowerCase().includes('audio')

    if (isAudioCommand) {
      await conn.sendMessage(m.chat, {
        audio: { url: videoUrl },
        mimetype: 'audio/mpeg',
        fileName: `audio_facebook.mp3`
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: `> ⓘ VIDEO DESCARGADO

> 📹 ${videoTitle}
> 🎬 Formato: MP4
> 🎁 Calidad: Original`
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error('Error en descarga Facebook:', error)

    await conn.reply(m.chat,
      `> ⓘ ERROR

> ❌ ${error.message}

> 💡 Verifica el enlace o intenta más tarde`, m)

    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

handler.help = ['fb', 'fbaudio']
handler.tags = ['downloader']
handler.command = ['fb','fbaudio']
handler.register = false

export default handler