let handler = async (m, { conn, isGroup }) => {
  if (!m.quoted)
    return conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTRUCCIONES ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Cita el mensaje a eliminar.`, m)

  try {
    const botJid = conn.decodeJid(conn.user.id)
    const senderJid = conn.decodeJid(m.sender)
    const quoted = m.quoted
    const quotedJid = conn.decodeJid(quoted.sender)

    const stanzaId = quoted.id
    const participant = quoted.participant || quotedJid

    if (!stanzaId || !participant)
      return conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ERROR ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> No se pudo identificar el mensaje.`, m)

    if (quotedJid === botJid) {
      // Eliminar mensaje propio
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: true,
          id: stanzaId
        }
      })
    } else {
      if (isGroup) {
        const { participants } = await conn.groupMetadata(m.chat)
        const isAdmin = jid => participants.some(p => p.id === jid && /admin|superadmin/i.test(p.admin || ''))

        if (!isAdmin(senderJid))
          return conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ PERMISO DENEGADO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Solo administradores pueden eliminar mensajes ajenos.`, m)

        if (!isAdmin(botJid))
          return conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ FALTA DE PERMISOS ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Necesito ser administrador para esta acción.`, m)
      }
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: stanzaId,
          participant: participant
        }
      })
    }
  } catch (err) {
    console.error('[ERROR delete]', err)
    conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ FALLO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> No se pudo eliminar el mensaje.
> WhatsApp puede limitar esta acción.`, m)
  }
}

handler.help = ['delete']
handler.tags = ['group']
handler.command = ['del', 'delete']
handler.botAdmin = true
handler.admin = true

export default handler
