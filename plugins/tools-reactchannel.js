import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) {
        await m.react('❓')
        return conn.reply(m.chat,
            `> \`🎯 REACCIONAR CANAL\` 🍙\n\n` +
            `> \`📝 Uso: ${usedPrefix}${command} reacción(es)\`\n\n` +
            `> \`💡 Ejemplo: ${usedPrefix}${command} 👍 ❤️\`\n\n` +
            `> \`🎭 Reacciones permitidas: Cualquier emoji\`\n\n` +
            `> \`📚 "Reacciona a la última publicación del canal"\` ✨`,
            m
        )
    }

    const reactEmojis = text.split(' ').join(',') // ← convierte "😂 🔥 😍" en "😂,🔥,😍"

    try {
        await m.react('⏳')

        // URL del canal actual
        const canalUrl = `https://wa.me/${m.chat}`

        const apiUrl =
            `https://api-adonix.ultraplus.click/tools/react?apikey=${global.apikey
            }&post_link=${encodeURIComponent(canalUrl)
            }&reacts=${encodeURIComponent(reactEmojis)}`

        const res = await fetch(apiUrl)
        const data = await res.json()

        if (data.status) {
            await m.react('✅')
            conn.reply(m.chat,
                `> \`✅ REACCIÓN ENVIADA\` 🍙\n\n` +
                `> \`🎭 Reacciones:\` ${reactEmojis.replace(/,/g, ' ')}\n` +
                `> \`📄 Publicación:\` Último post\n\n` +
                `> \`📚 "¡Reacciones aplicadas correctamente!"\` ✨`,
                m
            )
        } else {
            await m.react('❌')
            conn.reply(m.chat,
                `> \`❌ ERROR\` 🍙\n\n` +
                `> \`📚 No se pudo reaccionar al canal\`\n\n` +
                `> \`🍙 "Intenta con otras reacciones"\` ✨`,
                m
            )
        }

    } catch (e) {
        await m.react('❌')
        conn.reply(m.chat,
            `> \`❌ ERROR\` 🍙\n\n` +
            `> \`📚 ${e.message}\`\n\n` +
            `> \`🍙 "Problema al conectar con el servicio"\` ✨`,
            m
        )
    }
}

handler.help = ['reactcanal']
handler.tags = ['tools']
handler.command = ['reactcanal', 'reaccionarcanal', 'canalreact']
handler.group = true

export default handler