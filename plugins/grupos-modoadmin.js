let handler = async (m, { conn, usedPrefix, command, isAdmin, isROwner }) => {
    if (!m.isGroup) {
        await m.react('❌')
        return conn.reply(m.chat, 
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ RESTRICCIÓN ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Este comando solo funciona en grupos.`, m)
    }

    if (!isAdmin && !isROwner) {
        await m.react('🚫')
        return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ACCESO DENEGADO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Solo administradores pueden usar este comando.`, m)
    }

    let chat = global.db.data.chats[m.chat]
    let args = m.text.trim().split(' ').slice(1)
    let action = args[0]?.toLowerCase()

    if (!action || (action !== 'on' && action !== 'off')) {
        let status = chat.adminmode ? '⚜️ ACTIVADO' : '✖️ DESACTIVADO'
        await m.react('ℹ️')
        return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ PROTOCOLO ADMIN ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> Estado: ${status}

> Uso: ${usedPrefix}admin [on/off]`, m)
    }

    if (action === 'on') {
        if (chat.adminmode) {
            await m.react('ℹ️')
            return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INFORMACIÓN ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> El modo Admin ya está activado.`, m)
        }
        chat.adminmode = true
        await m.react('✅')
        conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ACTIVADO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Modo Admin activado.
> Solo administradores podrán usar comandos.`, m)

    } else if (action === 'off') {
        if (!chat.adminmode) {
            await m.react('ℹ️')
            return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INFORMACIÓN ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> El modo Admin ya está desactivado.`, m)
        }
        chat.adminmode = false
        await m.react('✅')
        conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ DESACTIVADO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Modo Admin desactivado.
> Todos pueden usar comandos.`, m)
    }
}

handler.help = ['admin on', 'admin off']
handler.tags = ['group']
handler.command = /^(admin)$/i
handler.group = true
handler.admin = true

export default handler
