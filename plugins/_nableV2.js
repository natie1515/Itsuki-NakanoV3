// plugins/grupo-info.js
let handler = async (m, { conn, usedPrefix }) => {
    let chat = global.db.data.chats[m.chat]
    
    // --- FUNCIÓN DE ESTADO IMPERIAL (SIN EMOJIS) ---
    const getStatus = (state) => state ? 'ACTIVO' : 'INACTIVO'

    let info = `
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| EDICTOS DEL IMPERIO DE BRITANNIA |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  
  [ PROTOCOLOS DE SEGURIDAD GEASS ]
  
  | Prohibición de Enlaces (AntiLink): ${getStatus(chat.antiLink)}
  | Restricción de Súbditos Árabes (AntiArabe): ${getStatus(chat.antiArabe)}
  
  [ CEREMONIAL DE INGRESO ]
  
  | Mensaje de Bienvenida (Welcome): ${getStatus(chat.welcome)}
  
  [ REGULACIONES SECUNDARIAS ]
  
  | Contenido Subversivo (NSFW): ${getStatus(chat.nsfw)}
  | Sistemas de Intercambio (Economy): ${getStatus(chat.economy)}
  | Azar y Destino (Gacha): ${getStatus(chat.gacha)}
  
  ${chat.rootowner ? '>> ¡ATENCIÓN! Bot solo responde a Mi Soberano <<' : ''}
  
  -- ESTE ES MI MANDATO. CERO --
  
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
`.trim()

    await m.reply(info)
}

handler.help = ['config', 'settings', 'configuracion']
handler.tags = ['group']
handler.command = /^(config|settings|configuracion)$/i
handler.group = true
export default handler
