import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { conn, text, args, usedPrefix }) => {
    if (!text) {
        return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ INSTRUCCIONES ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Uso: ${usedPrefix}pinterest <término>

> Ejemplo: ${usedPrefix}pinterest paisajes
> Ejemplo: ${usedPrefix}pinterest https://pinterest.com/pin/...

> Envía una imagen aleatoria de Pinterest.`, m)
    }

    try {
        await m.react('🕒')

        if (text.includes("https://")) {
            let i = await dl(args[0])
            if (i.msg) throw new Error(i.msg)
            
            let isVideo = i.download.includes(".mp4")
            await conn.sendMessage(m.chat, { 
                [isVideo ? "video" : "image"]: { url: i.download }, 
                caption: `┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ PINTEREST ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> ${i.title || 'Sin título'}` 
            }, { quoted: m })
            
        } else {
            const results = await pins(text)
            if (!results.length) {
                return conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ SIN RESULTADOS ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> No se encontraron resultados para "${text}".`, m)
            }

            const randomIndex = Math.floor(Math.random() * results.length)
            const selectedImage = results[randomIndex]

            const pinInfo = await getPinInfo(selectedImage)

            await conn.sendMessage(m.chat, { 
                image: { url: selectedImage.image_large_url }, 
                caption: `┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ PINTEREST ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Búsqueda: ${text}
> Título: ${pinInfo.title}
> Autor: ${pinInfo.user}
> Tablero: ${pinInfo.board}` 
            }, { quoted: m })

            await m.react('✅')
        }
    } catch (e) {
        await m.react('❌')
        await conn.reply(m.chat,
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ⓘ ERROR ┃
┗━━━━━━━━━━━━━━━━━━━━━┛

> Error: ${e.message}
> Intenta con otro término o enlace.`, m)
    }
}

handler.help = ['pinterest <término/enlace>']
handler.tags = ["descargas"]
handler.command = ['pinterest', 'pin']
handler.group = true

export default handler

async function getPinInfo(imageData) {
    try {
        if (imageData.pinner) {
            return {
                user: `${imageData.pinner.full_name || imageData.pinner.username} (${imageData.pinner.username || 'N/A'})`,
                title: `${imageData.title || imageData.grid_title || 'Sin título'}`,
                board: `${imageData.board?.name || 'Tablero no disponible'}`,
                link: imageData.url || `https://pinterest.com/pin/${imageData.id}/`
            }
        }

        return {
            user: 'Información no disponible',
            title: 'Sin título',
            board: 'Tablero no disponible',
            link: '#'
        }
    } catch (error) {
        return {
            user: 'Información no disponible',
            title: 'Sin título',
            board: 'Tablero no disponible',
            link: '#'
        }
    }
}

async function dl(url) {
    try {
        let res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(e => e.response)
        let $ = cheerio.load(res.data)
        let tag = $('script[data-test-id="video-snippet"]')
        if (tag.length) {
            let result = JSON.parse(tag.text())
            return {
                title: result.name,
                download: result.contentUrl
            }
        } else {
            let json = JSON.parse($("script[data-relay-response='true']").eq(0).text())
            let result = json.response.data["v3GetPinQuery"].data
            return {
                title: result.title,
                download: result.imageLargeUrl
            }
        }
    } catch {
        return { msg: "Error, inténtalo de nuevo más tarde" }
    }
}

const pins = async (judul) => {
    const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(judul)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22applied_unified_filters%22%3Anull%2C%22appliedProductFilters%22%3A%22---%22%2C%22article%22%3Anull%2C%22auto_correction_disabled%22%3Afalse%2C%22corpus%22%3Anull%2C%22customized_rerank_type%22%3Anull%2C%22domains%22%3Anull%2C%22dynamicPageSizeExpGroup%22%3A%22control%22%2C%22filters%22%3Anull%2C%22journey_depth%22%3Anull%2C%22page_size%22%3Anull%2C%22price_max%22%3Anull%2C%22price_min%22%3Anull%2C%22query_pin_sigs%22%3Anull%2C%22query%22%3A%22${encodeURIComponent(judul)}%22%2C%22redux_normalize_feed%22%3Atrue%2C%22request_params%22%3Anull%2C%22rs%22%3A%22typed%22%2C%22scope%22%3A%22pins%22%2C%22selected_one_bar_modules%22%3Anull%2C%22seoDrawerEnabled%22%3Afalse%2C%22source_id%22%3Anull%2C%22source_module_id%22%3Anull%2C%22source_url%22%3A%22%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(judul)}%26rs%3Dtyped%22%2C%22top_pin_id%22%3Anull%2C%22top_pin_ids%22%3Anull%7D%2C%22context%22%3A%7B%7D%7D`

    const headers = {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
    }

    try {
        const res = await axios.get(link, { headers })
        if (res.data && res.data.resource_response && res.data.resource_response.data && res.data.resource_response.data.results) {
            return res.data.resource_response.data.results.map(item => {
                if (item.images) {
                    return {
                        image_large_url: item.images.orig?.url || null,
                        pinner: item.pinner,
                        title: item.title,
                        board: item.board,
                        id: item.id,
                        url: item.url
                    }
                }
                return null
            }).filter(img => img !== null)
        }
        return []
    } catch (error) {
        console.error('Error:', error)
        return []
    }
}
