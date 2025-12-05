import fetch from "node-fetch";
import fs from "fs";
import path from "path";

async function makeFkontak() {
  try {
    const res = await fetch('https://i.postimg.cc/1XgvNWd8/gratis-png-spotify-logo-spotify-computer-icons-podcast-music-apps-thumbnail-(1)-(1)-(1).png')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { locationMessage: { name: 'Spotify', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return undefined
  }
}

async function searchSong(query) {
  const url = `https://spotdown.org/api/song-details?url=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { "Accept": "application/json, text/plain, */*" }
  });
  const data = await res.json();
  if (!data.songs || data.songs.length === 0) throw new Error("No se encontraron canciones");
  return data.songs[0];
}

async function downloadSong(songUrl, outputPath) {
  const res = await fetch("https://spotdown.org/api/download", {
    method: "POST",
    headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json" },
    body: JSON.stringify({ url: songUrl })
  });
  if (!res.ok) throw new Error("Error descargando la canción");

  const fileStream = fs.createWriteStream(outputPath);
  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
}

let handler = async (m, { conn, args, usedPrefix }) => {
  const query = args.join(" ");
  if (!query) {
    return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTRUCCIONES ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Uso: ${usedPrefix}song <nombre o enlace>

> Ejemplos:
> • ${usedPrefix}song bad bunny monaco
> • ${usedPrefix}song https://open.spotify.com/track/...

> El bot buscará la canción en Spotify.`, m)
  }
  
  try {
    await m.react('🕒')
    
    conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ BUSCANDO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Buscando: "${query.substring(0, 50)}..."
> Plataforma: Spotify`, m)

    const song = await searchSong(query);

    const tmpDir = path.join(".", "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const outputPath = path.join(tmpDir, `${song.title}.mp3`);

    await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ DESCARGANDO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Canción: ${song.title}
> Artista: ${song.artists || 'Desconocido'}
> Duración: ${song.duration || 'N/A'}`, m)

    await downloadSong(song.url, outputPath);

    const audioBuffer = fs.readFileSync(outputPath);

    await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ENVIANDO ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Transmitiendo audio...
> Tamaño: ${(audioBuffer.length / (1024 * 1024)).toFixed(2)} MB`, m)

    const quotedContact = await makeFkontak()
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: "audio/mpeg",
      fileName: `${song.title}.mp3`
    }, { quoted: quotedContact || m });
    
    await m.react('✅')
    
    // Limpiar archivo temporal
    try {
      fs.unlinkSync(outputPath)
    } catch {}
    
  } catch (err) {
    await m.react('❌')
    await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ERROR ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Error: ${err.message}
> Verifica el nombre o enlace e intenta nuevamente.`, m)
  }
};

handler.help = ['song <nombre/enlace>']
handler.tags = ['downloader']
handler.command = ["song", "spotify"];

export default handler;
