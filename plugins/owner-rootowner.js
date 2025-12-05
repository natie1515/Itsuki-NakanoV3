let handler = async (m, { conn, usedPrefix, isROwner }) => {
    // Solo el creador puede usar este comando
    if (!isROwner) return m.reply('> ⓘ Este comando solo puede ser ejecutado por mi creador.')

    let chat = global.db.data.chats[m.chat]

    // Verificar si el comando tiene argumentos
    let args = m.text.trim().split(' ').slice(1)
    let action = args[0]?.toLowerCase()

    if (!action || (action !== 'on' && action !== 'off')) {
        let status = chat.rootowner ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
        return m.reply(`╭─「 ⓘ MODO ROOTOWNER 」
│
│ Estado actual: ${status}
│
│ Uso del comando:
│ ├ ${usedPrefix}rootowner on
│ └ ${usedPrefix}rootowner off
│
│ Descripción:
│ Cuando está ACTIVADO, el bot solo
│ responderá a mensajes del Creador
│ en este grupo, mi señor.
╰─◉`.trim())
    }

    if (action === 'on') {
        if (chat.rootowner) {
            return m.reply('> ⓘ El modo *RootOwner* ya se encuentra activado, mi señor.')
        }
        chat.rootowner = true
        m.reply(`╭─「 ⓘ MODO ROOTOWNER ACTIVADO 」
│
│ Orden ejecutada exitosamente, mi señor.
│
│ Configuración aplicada:
│ ├ El bot responderá únicamente a sus mensajes.
│
│ Grupo: ${m.chat}
╰─◉`.trim())

    } else if (action === 'off') {
        if (!chat.rootowner) {
            return m.reply('> ⓘ El modo *RootOwner* ya se encuentra desactivado, mi señor.')
        }
        chat.rootowner = false
        m.reply(`╭─「 ⓘ MODO ROOTOWNER DESACTIVADO 」
│
│ Orden ejecutada exitosamente, mi señor.
│
│ Configuración aplicada:
│ ├ El bot responderá a todos los usuarios del grupo.
│
│ Grupo: ${m.chat}
╰─◉`.trim())
    }
}

handler.help = ['rootowner']
handler.tags = ['owner']
handler.command = /^(rootowner)$/i
handler.rowner = true

export default handler
