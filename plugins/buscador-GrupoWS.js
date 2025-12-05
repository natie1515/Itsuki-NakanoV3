import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Comando: Requisición de Búsqueda de Grupos de WhatsApp
    
    // --- 1. Verificación de Argumentos ---
    if (!text) {
        return conn.reply(m.chat, 
            `╭─「 ⓘ ORDEN INCOMPLETA 」
│
│ Se requiere la especificación del
│ nombre o tema de los grupos a
│ investigar. La directriz es vaga.
│
│ **Protocolo de Uso:**
│ └ ${usedPrefix + command} [Tema o Nombre]
╰─◉`, m)
    }
    
    // Indicador de Ejecución
    await m.react('🕰️') // Usamos un reloj para indicar espera/ejecución

    // --- 2. Ejecución de la Búsqueda ---
    try {
        const res = await fetch(`https://apiadonix.kozow.com/search/wpgroups?apikey=Adofreekey&q=${encodeURIComponent(text)}`)
        const json = await res.json()
        
        // --- 3. Verificación de Resultados ---
        if (!json.status || !json.data || json.data.length === 0) {
            return conn.reply(m.chat, 
                `╭─「 ❌ MISIÓN FALLIDA 」
│
│ No se han encontrado dominios ni
│ entidades que concuerden con la
│ búsqueda: *${text}*
│
│ El sistema no arrojó resultados válidos.
╰─◉`, m)
        }

        // --- 4. Presentación de Resultados (Máximo 10) ---
        let message = `╭─「 ♟️ INFORME DE RECONOCIMIENTO ♟️ 」
│
│ **Criterio de Búsqueda:** *${text}*
│
│ **Unidades Localizadas (Top 10):**
│
│ ${json.data.slice(0, 10).map((g, i) => 
            `│ ├ **${i + 1}.** [${g.name}]
│ └ **Vínculo de Acceso:** ${g.link}`
        ).join('\n│\n')}`
        
        message += `\n╰─◉\n\n**Comando ejecutado.**`

        conn.sendMessage(m.chat, { text: message }, { quoted: m })
        
    } catch (e) {
        // --- 5. Manejo de Errores Críticos ---
        console.error(e)
        conn.reply(m.chat, 
            `╭─「 🚨 FALLA CRÍTICA (X) 」
│
│ Una anomalía irrumpió la ejecución.
│ El proceso de búsqueda ha sido abortado.
│ Reporte el código de error al alto mando.
╰─◉`, m)
    }
}

handler.command = ['wpgroups']
handler.tags = ['buscador']
handler.help = ['wpgroups']
export default handler
