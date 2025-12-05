import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTRUCCIONES ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Envíe un enlace de TikTok.

> Formato: ${usedPrefix + command} <enlace>
> Ejemplo: ${usedPrefix + command} https://tiktok.com/@usuario/video/...

> Para audio: ${usedPrefix}ttaudio <enlace>`, m)
  }

  const isUrl = /(?:https:?\/{2})?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/([^\s&]+)/gi.test(text)
  
  // Verificar si parece un enlace (no solo texto)
  if (!isUrl && !text.match(/^(https?:\/\/|www\.|vm\.|vt\.|t\.)/i)) {
    return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ENLACE INVÁLIDO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> El texto proporcionado no es un enlace válido.
> Debe ser un enlace de TikTok.

> Ejemplos válidos:
> • https://tiktok.com/@usuario/video/...
> • https://vm.tiktok.com/...
> • https://www.tiktok.com/...`, m)
  }

  try {
    await m.react('🕒')

    if (isUrl) {
      const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}?hd=1`)
      const data = res.data?.data
      
      if (!data?.play && !data?.music) {
        return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ CONTENIDO NO DISPONIBLE ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> El enlace no contiene contenido descargable.
> Verifica que el video esté público.`, m)
      }

      const { title, duration, author, play, music } = data

      // Comando para audio
      if (command === 'tiktokaudio' || command === 'tta' || command === 'ttaudio') {
        if (!music) {
          return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ AUDIO NO DISPONIBLE ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> No se pudo obtener el audio del video.`, m)
        }

        await conn.sendMessage(
          m.chat,
          {
            audio: { url: music },
            mimetype: 'audio/mpeg',
            fileName: `tiktok_audio.mp3`,
            ptt: false
          },
          { quoted: m }
        )

        await m.react('✅')
        return
      }

      // Comando normal de TikTok (video)
      const caption = `┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ TIKTOK ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Título: ${title || 'Sin título'}
> Autor: ${author?.nickname || 'Desconocido'}`

      await conn.sendMessage(m.chat, { video: { url: play }, caption }, { quoted: m })

    } else {
      // Búsqueda por texto (solo para comando normal)
      if (command === 'tiktokaudio' || command === 'tta' || command === 'ttaudio') {
        return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ENLACE REQUERIDO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Para descargar audio necesitas un enlace de TikTok.
> Ejemplo: ${usedPrefix}ttaudio https://tiktok.com/...`, m)
      }

      const res = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: { keywords: text, count: 5, cursor: 0, HD: 1 }
      })

      const results = res.data?.data?.videos?.filter(v => v.play) || []
      if (results.length === 0) {
        return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ SIN RESULTADOS ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> No se encontraron videos para "${text}".`, m)
      }

      // Enviar solo el primer resultado
      const video = results[0]
      const caption = `┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ BÚSQUEDA TIKTOK ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Título: ${video.title || 'Sin título'}
> Autor: ${video.author?.nickname || 'Desconocido'}
> Búsqueda: ${text}`

      await conn.sendMessage(m.chat, { video: { url: video.play }, caption }, { quoted: m })
    }

    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ERROR ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Error: ${e.message || 'Desconocido'}
> Verifica el enlace e intenta nuevamente.`, m)
  }
}

handler.help = ['tiktok <enlace>', 'ttaudio <enlace>']
handler.tags = ['downloader']
handler.command = ['tiktok', 'tt', 'tiktokaudio', 'tta', 'ttaudio']
handler.group = true

export default handler
