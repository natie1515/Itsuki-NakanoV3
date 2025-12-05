import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  try {
    if (!args[0]) {
      return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTRUCCIONES ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Uso: ${usedPrefix}apk <nombre>

> Ejemplo: ${usedPrefix}apk whatsapp
> Ejemplo: ${usedPrefix}apk tiktok

> Descarga APKs desde Aptoide.`, m)
    }

    const appName = args.join(' ').toLowerCase()
    
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

    const apiUrl = `https://mayapi.ooguy.com/apk?query=${encodeURIComponent(appName)}&apikey=may-f53d1d49`
    const response = await fetch(apiUrl, { timeout: 30000 })

    if (!response.ok) {
      throw new Error(`Error API: ${response.status}`)
    }

    const data = await response.json()

    if (!data.status || !data.result) {
      throw new Error('Aplicación no encontrada')
    }

    const appData = data.result
    const downloadUrl = appData.url
    const appTitle = appData.title || appName
    const appVersion = appData.version || 'Última versión'
    const appSize = appData.size || 'Tamaño no disponible'
    const appDeveloper = appData.developer || 'Desarrollador no disponible'

    let appImage = null
    try {
      if (appData.icon) {
        appImage = appData.icon
      } else if (appData.image) {
        appImage = appData.image
      } else if (appData.screenshot) {
        appImage = appData.screenshot[0]
      }
    } catch (imgError) {
      console.log('Sin imagen disponible')
    }

    if (!downloadUrl) {
      throw new Error('Enlace de descarga no disponible')
    }

    await conn.sendMessage(m.chat, { react: { text: '📱', key: m.key } })

    if (appImage) {
      await conn.sendMessage(m.chat, {
        image: { url: appImage },
        caption: 
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ APLICACIÓN ENCONTRADA ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> Nombre: ${appTitle}
> Versión: ${appVersion}
> Tamaño: ${appSize}
> Desarrollador: ${appDeveloper}`
      }, { quoted: m })
    } else {
      await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ APLICACIÓN ENCONTRADA ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> Nombre: ${appTitle}
> Versión: ${appVersion}
> Tamaño: ${appSize}
> Desarrollador: ${appDeveloper}`, m)
    }

    await conn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${appTitle.replace(/\s+/g, '_')}.apk`,
      caption: 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ APK DESCARGADA ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Nombre: ${appTitle}
> Versión: ${appVersion}
> Tamaño: ${appSize}
> Desarrollador: ${appDeveloper}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error('Error APK:', error)

    await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ERROR ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Error: ${error.message}
> Intenta con otro nombre de aplicación.`, m)

    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

handler.help = ['apk <nombre>']
handler.tags = ['downloader']
handler.command = ['apk', 'apkdl', 'descargarapk']
handler.register = false

export default handler
