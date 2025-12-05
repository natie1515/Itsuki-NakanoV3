let handler = async function (m, { conn, participants, groupMetadata }) {
    if (!m.isGroup) return m.reply('ⓘ `Este comando solo funciona en grupos.`')

    const participantList = groupMetadata.participants || []
    
    let teks = `ⓘ \`LISTA DE ADMINISTRADORES DEL GRUPO\` 👑\n\n`
    teks += `ⓘ \`Información del grupo:\`\n`
    teks += `ⓘ \`Nombre:\` ${groupMetadata.subject || 'Sin nombre'}\n`
    teks += `ⓘ \`Total de miembros:\` ${participantList.length}\n\n`
    teks += `┌──「 *ADMINISTRADORES* 」──┐\n`
    
    const admins = participantList.filter(p => p.admin)
    
    if (admins.length === 0) {
        teks += `│\n`
        teks += `│ ⓘ \`Este grupo no tiene administradores.\`\n`
        teks += `│ ⓘ \`No hay estructura de administración.\`\n`
    } else {
        teks += `│\n`
        admins.forEach((admin, index) => {
            const userId = admin.id.split('@')[0]
            teks += `│ 👑 *Administrador #${index + 1}*\n`
            teks += `│ ⓘ \`Tag:\` @${userId}\n`
            teks += `│ ⓘ \`Tipo:\` ${admin.admin === 'superadmin' ? 'Super Admin' : 'Admin'}\n`
            teks += `│${index === admins.length - 1 ? '' : '\n'}`
        })
    }
    
    teks += `│\n`
    teks += `└──「 *Total: ${admins.length} administradores* 」──┘\n\n`
    
    const regularMembers = participantList.filter(p => !p.admin)
    if (regularMembers.length > 0) {
        teks += `ⓘ \`Miembros regulares:\` ${regularMembers.length}\n`
    }
    
    teks += `ⓘ \`Información obtenida correctamente.\``

    await conn.sendMessage(m.chat, { 
        text: teks, 
        mentions: admins.map(p => p.id)
    })
    
    await m.react('👑')
}

handler.help = ['lid', 'admins', 'administradores']
handler.tags = ['group']
handler.command = /^(lid|admins|administradores)$/i
handler.group = true

export default handler
