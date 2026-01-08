import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '👑', key: m.key } })

    const menuText = `> *@Hola, soy 𓆩‌۫᷼ ִֶָღ݉͢𝓢𝓪𝓻𝓪𝓱𓆪‌, Owner de Y͟u͟m͟ï̵̬͟͜𝐁o̸t̸ V3*\n\n> ᴇʟɪɢᴇ ᴄóᴍᴏ ǫᴜɪᴇʀᴇs ᴄᴏɴᴛᴀᴄᴛᴀʀᴍᴇ :`

    const imageUrl = 'https://i.postimg.cc/76JgSYTK/615d6330db9a6e48977bcc4f9e4d0b4e.jpg'

    const nativeButtons = [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ 
          display_text: 'Instagram 📸', 
          url: 'https://www.instagram.com/leonela.y14?igsh=ZDhlZHFsNzh4eXo='  // ← Instagram actualizado
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ 
          display_text: 'Owner 👑', 
          url: 'https://wa.me/559296077349'
        })
      }
    ]

    const media = await prepareWAMessageMedia(
      { image: { url: imageUrl } }, 
      { upload: conn.waUploadToServer }
    )

    const header = proto.Message.InteractiveMessage.Header.fromObject({
      hasMediaAttachment: true,
      imageMessage: media.imageMessage
    })

    const interactiveMessage = proto.Message.InteractiveMessage.fromObject({
      body: proto.Message.InteractiveMessage.Body.fromObject({ text: menuText }),
      header,
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: nativeButtons
      })
    })

    const msg = generateWAMessageFromContent(
      m.chat, 
      { interactiveMessage }, 
      { userJid: conn.user.jid, quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error('❌ Error en el comando owner:', e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al cargar la información del owner*\n\n🔗 Contacto directo: https://wa.me/593994524688\n\n⚠️ *Error:* ${e.message}`
    }, { quoted: m })
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'contacto']

export default handler
