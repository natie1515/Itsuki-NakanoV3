import { Sticker, StickerTypes } from 'wa-sticker-formatter'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false

  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    // ⓘ Verificación inicial del recurso
    if (!/webp|image|video/g.test(mime) && !args[0]) {
      await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
      return conn.reply(m.chat, 
        `ⓘ \`PROTOCOLO DE STICKER INICIADO\` 🏁\n\n` +
        `ⓘ \`Formato incorrecto o recurso no especificado.\`\n` +
        `ⓘ \`Responde a una imagen o video con:\` ${usedPrefix + command}\n\n` +
        `ⓘ \`Alternativamente, proporciona una URL estratégica.\``, 
        m
      )
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    if (/webp|image|video/g.test(mime)) {
      // ⓘ Protocolo de límite temporal estratégico
      if (/video/g.test(mime)) {
        if ((q.msg || q).seconds > 180) {
          await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
          return conn.reply(m.chat, 
            `ⓘ \`LÍMITE TEMPORAL EXCEDIDO\` 🕒\n\n` +
            `ⓘ \`Duración máxima permitida:\` 3 minutos\n` +
            `ⓘ \`Duración detectada:\` ${(q.msg || q).seconds} segundos\n\n` +
            `ⓘ \`La eficiencia requiere límites calculados. Recorta el material.\``, 
            m
          )
        }
      }

      // ⓘ Descarga del recurso objetivo
      let img = await q.download?.()
      if (!img) throw new Error('ⓘ `Fallo en adquisición del recurso. Reintentar operación.`')

      const stickerOptions = {
        // ⓘ Configuración táctica - Sin metadatos para operaciones discretas
        type: StickerTypes.FULL,
        quality: 70, // ⓘ Calidad optimizada para distribución
        pack: 'SISTEMA IMPERIAL', // ⓘ Identificación estratégica mínima
        author: '♟️' // ⓘ Firma táctica
      }

      const sticker = new Sticker(img, stickerOptions)
      stiker = await sticker.toBuffer()

    } else if (args[0]) {
      // ⓘ Protocolo de URL remota
      if (isUrl(args[0])) {
        const stickerOptions = {
          type: StickerTypes.FULL,
          quality: 70,
          pack: 'RECURSO EXTERNO',
          author: '🌐'
        }

        const sticker = new Sticker(args[0], stickerOptions)
        stiker = await sticker.toBuffer()
      } else {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        return conn.reply(m.chat, 
          `ⓘ \`URL NO VÁLIDA\` 🔗\n\n` +
          `ⓘ \`El enlace proporcionado no cumple con los protocolos de acceso.\`\n` +
          `ⓘ \`Formato requerido:\` https://dominio.com/imagen.jpg\n\n` +
          `ⓘ \`Verifica la integridad del enlace e intenta nuevamente.\``, 
          m
        )
      }
    }

    // ⓘ Distribución del sticker generado
    if (stiker) {
      const fkontak = await makeFkontak()
      await conn.sendMessage(m.chat, {
        sticker: stiker
      }, { quoted: fkontak })
      
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      
      // ⓘ Confirmación táctica adicional
      setTimeout(async () => {
        try {
          await conn.reply(m.chat,
            `ⓘ \`OPERACIÓN STICKER COMPLETADA\` ✅\n\n` +
            `ⓘ \`Sticker generado y distribuido exitosamente.\` 🏷️\n` +
            `ⓘ \`Protocolo:\` ${/webp/.test(mime) ? 'WebP' : /image/.test(mime) ? 'Imagen' : /video/.test(mime) ? 'Video' : 'URL Externa'}\n` +
            `ⓘ \`Calidad:\` 70% (Optimizada)\n\n` +
            `ⓘ \`Recurso convertido según parámetros estratégicos. Listo para uso operativo.\``,
            m
          )
        } catch {
          // ⓘ Confirmación redundante fallida - Operación principal exitosa
        }
      }, 500)
    }

  } catch (error) {
    console.error('ⓘ Error en sistema de stickers:', error)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.reply(m.chat, 
      `ⓘ \`ERROR EN GENERACIÓN DE STICKER\` ⚠️\n\n` +
      `ⓘ \`Fallo en el proceso de conversión.\`\n` +
      `ⓘ \`Causa probable:\` ${error.message}\n\n` +
      `ⓘ \`Verifica el recurso y reintenta la operación. Variables imprevistas recalibradas.\``, 
      m
    )
  }
}

// ⓘ Sistema de contacto tácticamente optimizado
async function makeFkontak() {
  try {
    const { default: fetch } = await import('node-fetch')
    const res = await fetch('https://cdn.russellxz.click/64bba973.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { 
        locationMessage: { 
          name: 'ⓘ STICKER IMPERIAL GENERADO ♟️', 
          jpegThumbnail: thumb2 
        } 
      },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return undefined // ⓘ Fallback silencioso - Parte de la estrategia
  }
}

handler.help = ['sticker', 's']
handler.tags = ['tools']
handler.command = ['s', 'sticker', 'stickerimperial', 'crearsticker']

// ⓘ Información extendida del comando
handler.info = 
  `ⓘ \`sticker\` - Convierte imágenes, videos o URLs en stickers tácticos.\n` +
  `ⓘ \`Límites estratégicos:\` 3 minutos para videos, calidad optimizada al 70%.\n` +
  `ⓘ \`Formato:\` ${usedPrefix}sticker [imagen/video/URL]\n` +
  `ⓘ \`Eficiencia calculada y verificada.\``

export default handler

// ⓘ Función de validación de URL mejorada
const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|webp|mp4|mov|avi)/, 'gi'))
}
