import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import { dirname } from 'path' 

global.__dirname = (url) => dirname(fileURLToPath(url));


//aquí los retirados👑🥀
global.retirado = [
['51906278352','Root-Botnet',true]
];

/*habrán comandos especiales para los retirados algo q los identifique | nota ustedes pondrán los coamndos y q solo funcione para los retirados*/

// Configuraciones principales
global.roowner = ['559296077349', '51932884973']
global.owner = [
   ['559296077349', '𓆩‌۫᷼ ִֶָღ݉͢𝓢𝓪𝓻𝓪𝓱𓆪‌', true],
   ['51906278352', 'Root-Botnet  🦇🩸', true],
   
   ];

global.mods = ['51906278352', '51932884973']
global.suittag = ['51906278352', '51932884973']
global.prems = ['51906278352', '51932884973']

// Información del bot 
global.libreria = 'Baileys'
global.baileys = 'V 6.7.9'
global.languaje = 'Español'
global.vs = '7.5.2'
global.vsJB = '5.0'
global.nameqr = 'Y͟u͟m͟ï̵̬͟͜𝐁o̸t̸qr'
global.namebot = 'Y͟u͟m͟ï̵̬͟͜𝐁o̸t̸'
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.ItsukiJadibts = true
global.Choso = true
global.prefix = ['.', '!', '/' , '#', '%']
global.apikey = 'ItsukiNakanoIA'
global.botNumber = ''
// Números y settings globales para varios códigos
global.packname = '𝗟𝗮 𝗠𝗲𝗷𝗼𝗿 𝗕𝗼𝘁 𝗗𝗲 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽 🫰🏻🤖'
global.botname = '🧋 Y͟u͟m͟ï̵̬͟͜𝐁o̸t̸ - 𝐍 𝐄 𝐖 ❄️'
global.wm = '© Root'
global.wm3 = '⫹⫺ 𝙈𝙪𝙡𝙩𝙞-𝘿𝙚𝙫𝙞𝙘𝙚 💻'
global.author = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ 𓆩‌۫᷼ ִֶָღ݉͢𝓢𝓪𝓻𝓪𝓱𓆪‌‹࣭݊𓂃ⷪ ִֶָ ᷫ‹ ⷭ.࣭𓆩‌۫᷼Ⴕ۫͜𓆪‌'
global.dev = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ 𓆩‌۫᷼ ִֶָღ݉͢𝓢𝓪𝓻𝓪𝓱𓆪‌‹࣭݊𓂃ⷪ ִֶָ ᷫ‹ ⷭ.࣭𓆩‌۫᷼Ⴕ۫͜𓆪‌'
global.textbot = 'Y͟u͟m͟ï̵̬͟͜𝐁o̸t̸|IAV3 Root'
global.etiqueta = '@Root-𓆩‌۫᷼ ִֶָღ݉͢𝓢𝓪𝓻𝓪𝓱𓆪‌'
global.gt = '© 𝐂𝐫𝐞𝐚𝐝𝐨 𝐏𝐨𝐫 𓆩‌۫᷼ ִֶָღ݉͢𝓢𝓪𝓻𝓪𝓱𓆪‌ Y͟u͟m͟ï̵̬͟͜𝐁o̸t̸-𝐂𝐡𝐚𝐧 𝐓𝐡𝐞 𝐁𝐞𝐬𝐭 𝐁𝐨𝐭𝐬 𝐎𝐟 𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩 🤖👑'
global.me = '🌨️ Y͟u͟m͟ï̵̬͟͜𝐁o̸t̸ 𝙼𝙴𝚆 𝚄𝙿𝙳𝙰𝚃𝙴 ☃️'
global.listo = '*Aqui tiene*'
global.moneda = 'Yenes'
global.multiplier = 69
global.maxwarn = 3
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

// Enlaces oficiales del bot
global.gp1 = 'https://chat.whatsapp.com/IKY7BgP20J5BYRiRZzINQU'
global.comunidad1 = 'https://chat.whatsapp.com/FFl5CSUCbBqLVdiRaFVmHp'
global.channel = 'https://whatsapp.com/channel/0029VaCDajZ9WtBvBZy76k2h'
global.channel2 = 'https://whatsapp.com/channel/0029VaCDajZ9WtBvBZy76k2h'
global.md = ''
global.correo = 'yuminotify.supp@gmail.com'

// Apis para las descargas y más
global.APIs = {
  ryzen: 'https://api.ryzendesu.vip',
  xteam: 'https://api.xteam.xyz',
  lol: 'https://api.lolhuman.xyz',
  delirius: 'https://delirius-apiofc.vercel.app',
  siputzx: 'https://api.siputzx.my.id', // usado como fallback para sugerencias IA
  mayapi: 'https://mayapi.ooguy.com'
}

global.APIKeys = {
  'https://api.xteam.xyz': 'YOUR_XTEAM_KEY',
  'https://api.lolhuman.xyz': 'API_KEY',
  'https://api.betabotz.eu.org': 'API_KEY',
  'https://mayapi.ooguy.com': 'may-f53d1d49'
}

// Endpoints de IA
global.SIPUTZX_AI = {
  base: global.APIs?.siputzx || 'https://api.siputzx.my.id',
  bardPath: '/api/ai/bard',
  queryParam: 'query',
  headers: { accept: '*/*' }
}


global.chatDefaults = {
  isBanned: false,
  sAutoresponder: '',
  welcome: true,
  autolevelup: false,
  autoAceptar: false,
  autosticker: false,
  autoRechazar: false,
  autoresponder: false,
  detect: true,
  antiBot: false,
  antiBot2: false,
  modoadmin: false,
  antiLink: true,
  antiImg: false,
  reaction: false,
  nsfw: false,
  antifake: false,
  delete: false,
  expired: 0,
  antiLag: false,
  per: [],
  antitoxic: false
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  try { import(pathToFileURL(file).href + `?update=${Date.now()}`) } catch {}
})

// Configuraciones finales
export default {
  prefix: global.prefix,
  owner: global.owner,
  sessionDirName: global.sessions,
  sessionName: global.sessions,
  botNumber: global.botNumber,
  chatDefaults: global.chatDefaults
}
