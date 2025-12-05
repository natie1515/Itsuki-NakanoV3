// plugins/grupo-info.js
let handler = async (m, { conn, usedPrefix }) => {
    let chat = global.db.data.chats[m.chat]
    
    // Mantenemos los emojis originales para el estado (🟢/🔴)
    
    let info = `> 👑 *EDICTOS DEL IMPERIO DE BRITANNIA*
 
> ִ \`CONFIGURACIÓN DEL DOMINIO\` ! ୧ ֹ 
 
> ੭੭﹙❐﹚ *PROTOCOLOS DE GEASS (SEGURIDAD)*
> ੭੭﹙⤷﹚ 🛡️ AntiLink: ${chat.antiLink ? '🟢' : '🔴'}
> ੭੭﹙⤷﹚ 🛡️ Restricción Árabe (AntiArabe): ${chat.antiArabe ? '🟢' : '🔴'}
 
> ੭੭﹙❐﹚ *CEREMONIAL Y BIENVENIDA*
> ੭੭﹙⤷﹚ 🎉 Mensaje de Ingreso (Welcome): ${chat.welcome ? '🟢' : '🔴'}
 
> ੭੭﹙❐﹚ *REGULACIONES SECUNDARIAS*
> ੭੭﹙⤷﹚ ⚙️ Contenido Subversivo (NSFW): ${chat.nsfw ? '🟢' : '🔴'}
> ੭੭﹙⤷﹚ ⚙️ Sistemas de Intercambio (Economy): ${chat.economy ? '🟢' : '🔴'}
> ੭੭﹙⤷﹚ ⚙️ Azar y Destino (Gacha): ${chat.gacha ? '🟢' : '🔴'}
 
${chat.rootowner ? `> ੭੭﹙🚨﹚ *¡DECRETO IMPERIAL!* Solo atiendo a Mi Soberano` : ''}
 
> *-- ESTE ES MI MANDATO. CERO --*
`.trim()

    await m.reply(info)
}

handler.help = ['config', 'settings', 'configuracion']
handler.tags = ['group']
handler.command = /^(config|settings|configuracion)$/i
handler.group = true
export default handler
