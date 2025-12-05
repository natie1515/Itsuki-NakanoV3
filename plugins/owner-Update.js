import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

// Miniatura de contacto de Lelouch
async function makeFkontak() {
  try {
    const res = await fetch('https://i.postimg.cc/mk8FDzNc/descarga.jpg') // Imagen de Lelouch
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { locationMessage: { name: '⚜️ Sistema Lelouch ✅', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return null
  }
}

let handler = async (m, { conn, args }) => {
  try {
    await m.react('🔄')

    const gitArgs = ['--no-pager', 'pull', '--rebase', '--autostash', ...(args || [])]
    const output = execSync(`git ${gitArgs.join(' ')}`, { cwd: ROOT, encoding: 'utf8' })

    const lower = output.toLowerCase()
    const isUpToDate = lower.includes('already up to date') || lower.includes('up to date')
    let response

    if (isUpToDate) {
      response = `> ⚜️ *¡Lelouch ya está actualizado!*\n\n> ⚜️ *El bot está al día con las últimas mejoras*`
      await m.react('✅')
    } else {
      const changed = []
      const lines = output.split(/\r?\n/)
      for (const ln of lines) {
        const match = ln.match(/^\s*([A-Za-z0-9_\-./]+)\s*\|\s*\d+/)
        if (match && match[1] && !changed.includes(match[1])) changed.push(match[1])
      }

      const banner = [
        '> ⚜️ *¡ACTUALIZACIÓN EXITOSA!*',
        '> ╰─────────────────',
        '',
        '> ⚜️ *Archivos actualizados:*',
        ''
      ]
      const list = changed.slice(0, 10).map(f => `> ⚜️ ${f}`).join('\n') || '> ⚜️ *Todos los archivos actualizados*'
      response = `${banner.join('\n')}\n${list}\n\n> ⚜️ *¡Lelouch está listo!*`
      await m.react('✅')
    }

    const fq = await makeFkontak().catch(() => null)
    await conn.reply(m.chat, response, fq || m)
  } catch (error) {
    await m.react('❌')

    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim()
      if (status) {
        const conflictedFiles = status
          .split('\n')
          .filter(Boolean)
          .filter(line => !(
            line.includes('node_modules') ||
            line.includes('sessions') ||
            line.includes('sessions-qr') ||
            line.includes('botSession') ||
            line.includes('.cache') ||
            line.includes('tmp/') ||
            line.includes('temp/') ||
            line.includes('.npm') ||
            line.includes('package-lock.json') ||
            line.includes('database.json')
          ))

        if (conflictedFiles.length > 0) {
          const conflictMsg = '> ⚜️ *¡Ops! Conflictos detectados*\n\n' +
            '> ⚜️ *Archivos con conflictos:*\n\n' +
            conflictedFiles.map(f => '> ⚜️ ' + f.slice(3)).join('\n') +
            '\n\n> ⚜️ *Para solucionar:*\n' +
            '> ⚜️ • Haz backup de tus cambios\n' +
            '> ⚜️ • O actualiza manualmente'
          return await conn.reply(m.chat, conflictMsg, m)
        }
      }
    } catch {}

    const msg = /not a git repository/i.test(error?.message || '')
      ? '> ⚜️ *¡Error!*\n\n> ⚜️ Este directorio no es un repositorio Git.\n> ⚜️ Inicializa con `git init` y agrega el remoto.'
      : `> ⚜️ *¡Error en la actualización!*\n\n> ⚜️ ${error?.message || 'Error desconocido.'}`
    await conn.reply(m.chat, msg, m)
  }
}

handler.help = ['update', 'actualizar']
handler.command = /^(update|actualizar|up)$/i
handler.tags = ['owner']
handler.rowner = true

export default handler
