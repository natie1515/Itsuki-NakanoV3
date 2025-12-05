import fs from 'fs'
import path from 'path'

var handler = async (m, conn) => {
    try {
        await m.react('⏳')
        
        const scanTargets = {
            plugins: './plugins',
            lib: './lib',
            handler: './handler.js',
            index: './index.js',
            config: './config.js',
            database: './database',
            utils: './utils'
        }

        let response = 'ⓘ *Resultado del escaneo, mi señor.*\n\n'
        let hasErrors = false

        for (const [targetName, targetPath] of Object.entries(scanTargets)) {
            if (!fs.existsSync(targetPath)) continue

            if (fs.lstatSync(targetPath).isDirectory()) {
                response += `ⓘ *Directorio:* ${targetName}\n`
                const files = fs.readdirSync(targetPath)
                    .filter(file => file.endsWith('.js') || file.endsWith('.json'))

                if (files.length === 0) {
                    response += `ⓘ Carpeta vacía\n\n`
                    continue
                }

                for (const file of files) {
                    await scanFile(path.join(targetPath, file), file, targetName)
                }
            } else {
                response += `ⓘ *Archivo:* ${targetName}\n`
                await scanFile(targetPath, targetName, 'root')
            }
        }

        async function scanFile(filePath, fileName, targetName) {
            try {
                const fileContent = fs.readFileSync(filePath, 'utf-8')

                try {
                    await import(path.resolve(filePath))
                } catch (error) {
                    hasErrors = true
                    const stackLines = error.stack?.split('\n') || []
                    const errorLineMatch = stackLines[0]?.match(/:(\d+):\d+/)
                    const errorLine = errorLineMatch ? errorLineMatch[1] : 'Desconocido'
                    response += `\n⚠️ *Error detectado en:* ${fileName}\n`
                    response += `> ⓘ Tipo: ${error.name}\n`
                    response += `> ⓘ Mensaje: ${error.message}\n`
                    response += `> ⓘ Línea: ${errorLine}\n`
                }

                if (!hasErrors) {
                    response += `✅ ${fileName} - Sin errores\n`
                }
                response += '\n'
            } catch (err) {
                response += `\n‼️ *Error en escaneo:* ${fileName}\n`
                response += `> ⓘ ${err.message}\n\n`
            }
        }

        if (!hasErrors) {
            response = 'ⓘ *Todo está en orden, mi señor. El sistema funciona correctamente.* ✅'
        }

        await m.reply(response)
        await m.react(hasErrors ? '⚠️' : '✅')
    } catch (err) {
        await m.react('✖️')
        await m.reply(`ⓘ Error crítico en el escaneo, mi señor: ${err.message}`)
    }
}

handler.command = handler.help = ['detectar']
handler.tags = ['owner']
handler.rowner = true

export default handler
