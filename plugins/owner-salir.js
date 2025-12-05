let handler = async (m, { conn, text, command }) => {
    let id = text ? text : m.chat
    let chat = global.db.data.chats[m.chat]
    
    // Desactivar temporalmente las bienvenidas
    chat.welcome = false

    await conn.reply(id, `> ⓘ Orden ejecutada: Me retiro del grupo, mi señor.`)
    await conn.groupLeave(id)

    try {
        // Reactivar bienvenidas tras la salida
        chat.welcome = true
    } catch (e) {
        await m.reply('> ⓘ Error al procesar la salida, mi señor.')
        console.log(e)
    }
}

handler.command = ['salir','leavegc','salirdelgrupo','leave']
handler.group = true
handler.rowner = true

export default handler
