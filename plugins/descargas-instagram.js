import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, args, command }) => {
  try {
    if (!args[0]) {
      return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTRUCCIONES ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Uso: ${usedPrefix}ig <enlace>

> Ejemplos:
> • ${usedPrefix}ig https://instagram.com/p/...
> • ${usedPrefix}ig https://instagram.com/reel/...

> Para audio: ${usedPrefix}igaudio <enlace>`, m)
    }

    const url = args[0]
    if (!url.match(/instagram\.com/)) {
      return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ENLACE INVÁLIDO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> El enlace debe ser de Instagram.

> Ejemplos válidos:
> • https://instagram.com/p/...
> • https://instagram.com/reel/...`, m)
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

    // API principal
    const api1 = `https://mayapi.ooguy.com/instagram?url=${encodeURIComponent(url)}&apikey=may-f53d1d49`
    // API secundaria
    const api2 = `https://apiadonix.kozow.com/download/instagram?apikey=${global.apikey}&url=${encodeURIComponent(url)}`

    let mediaUrl, mediaTitle, mediaType

    try {
      const res = await fetch(api1, { timeout: 30000 })
      if (!res.ok) throw new Error('Error en API principal')
      const data = await res.json()

      if (data.result?.url) {
        mediaUrl = data.result.url
        mediaTitle = data.result.title || 'Instagram'
        mediaType = data.result.type || 'video'
      } else if (data.url) {
        mediaUrl = data.url
        mediaTitle = data.title || 'Instagram'
        mediaType = data.type || 'video'
      } else if (data.data?.url) {
        mediaUrl = data.data.url
        mediaTitle = data.data.title || 'Instagram'
        mediaType = data.data.type || 'video'
      }
    } catch {
      const res2 = await fetch(api2, { timeout: 30000 })
      if (!res2.ok) throw new Error('Error en API de respaldo')
      const data2 = await res2.json()

      const adonixData = Array.isArray(data2.data) ? data2.data[0] : data2.data
      mediaUrl = adonixData?.url
      mediaTitle = 'Instagram'
      mediaType = mediaUrl?.includes('.mp4') ? 'video' : 'image'
    }

    if (!mediaUrl) {
      throw new Error('No se encontró contenido válido')
    }

    const isVideo = mediaType === 'video' || mediaUrl.includes('.mp4')
    const isAudioCommand = command.toLowerCase().includes('audio')

    if (isAudioCommand && isVideo) {
      await conn.sendMessage(m.chat, {
        audio: { url: mediaUrl },
        mimetype: 'audio/mpeg',
        fileName: `instagram_audio.mp3`
      }, { quoted: m })
    } else if (isVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: mediaUrl },
        caption: `┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTAGRAM VIDEO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Título: ${mediaTitle}
> Formato: MP4
> Fuente: Instagram`, m)
    } else {
      await conn.sendMessage(m.chat, {
        image: { url: mediaUrl },
        caption: `┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTAGRAM IMAGEN ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Título: ${mediaTitle}
> Formato: JPEG
> Fuente: Instagram`, m)
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error('Error Instagram:', error)
    await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ERROR ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Error: ${error.message}
> Verifica el enlace e intenta nuevamente.`, m)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

handler.help = ['ig <enlace>', 'igaudio <enlace>']
handler.tags = ['downloader']
handler.command = ['ig', 'igaudio']
handler.register = false

export default handler
