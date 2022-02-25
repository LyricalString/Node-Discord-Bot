const fs = require('fs')
const stdin = process.openStdin();

function token({env = "mode=development\n", envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m", 'Ingresa el token del bot:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}token=${data || envVals.find(i=>i.prop === 'token')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function lang({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m", 'Escoge un lenguaje:')
        console.log('1 - Es (default)')
        console.log('2 - En')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            if (['2', 'en', 'en_us'].includes(data.toLowerCase())) return resolve({
                env: `${env}lang=en_US\n`,
                envVals
            })
            return resolve({
                env: `${env}lang=${envVals.find(i=>i.prop === 'lang')?.value || 'es_ES'}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function prefix({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Establece un prefijo por defecto:')
        console.log('! (por default)')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            if (data.length > 0) return resolve({
                env: `${env}prefix=${data}\n`,
                envVals
            })
            return resolve({
                env: `${env}prefix=${envVals.find(i=>i.prop === 'prefix')?.value || '!'}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function botId({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa el id del bot:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}botID=${data || envVals.find(i=>i.prop === 'botID')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function mongoURL({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa la URL de tu MongoDB:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}MONGO_URL=${data || envVals.find(i=>i.prop === 'MONGO_URL')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function embedColor({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Establece un color preferido para los embeds:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}EMBED_COLOR=${data || envVals.find(i=>i.prop === 'EMBED_COLOR')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function errorWebhookID({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa el ID del WebHook de errores:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}errorWebhookID=${data || envVals.find(i=>i.prop === 'errorWebhookID')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function errorWebhookToken({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa el token del WebHook de errores:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}errorWebhookToken=${data || envVals.find(i=>i.prop === 'errorWebhookToken')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function errorChannel({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa el ID del canal de errores:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}errorChannel=${data || envVals.find(i=>i.prop === 'errorChannel')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function topggToken({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa tu token de topGG:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}topggToken=${data || envVals.find(i=>i.prop === 'topggToken')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function clientIDSpotify({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa el ID del cliente de Spotify:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}clientIDSpotify=${data || envVals.find(i=>i.prop === 'clientIDSpotify')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function clientSecretSpotify({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa el token del cliente de Spotify:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}clientSecretSpotify=${data || envVals.find(i=>i.prop === 'clientSecretSpotify')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function guildAddWebhookID({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa el ID del webhook donde se enviarán las notificaciones para nuevos servidores:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}guildAddWebhookID=${data || envVals.find(i=>i.prop === 'guildAddWebhookID')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function guildAddWebhookToken({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa el token del webhook donde se enviarán las notificaciones para nuevos servidores:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}guildAddWebhookToken=${data || envVals.find(i=>i.prop === 'guildAddWebhookToken')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function OsuSecret({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa la clave API para OSU:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}OsuSecret=${data || envVals.find(i=>i.prop === 'OsuSecret')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}

function trnAPIKey({env, envVals = []}) {
    return new Promise(resolve => {
        console.log("\x1b[32m%s\x1b[0m",'Ingresa la clave API para TRN (comando de fnprofile):')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}trnAPIKey=${data || envVals.find(i=>i.prop === 'trnAPIKey')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data',onData)
    })
}
fs.readFile('./.env', (err, data) => {
    if (err && err.code !== 'ENOENT') return console.log(err)
    const envVals = (data ?? '').toString().split('\n').filter(Boolean).map(i => ({
        prop: i.split('=')[0],
        value: i.split('=')[1]
    }))
    token({envVals}).then(lang).then(prefix).then(botId).then(mongoURL).then(embedColor)
        .then(errorWebhookID).then(errorWebhookToken).then(errorChannel).then(topggToken)
        .then(clientIDSpotify).then(clientSecretSpotify).then(guildAddWebhookID)
        .then(guildAddWebhookToken).then(OsuSecret).then(trnAPIKey).then(({env}) => {
        fs.writeFile('./.env', env, (err) => {
            if(err) return console.error(err)
            console.log("\x1b[35m%s\x1b[0m",'.env creado')
            console.log("\x1b[31m%s\x1b[0m", 'Importante:')
            console.log("\x1b[33mEl .env es un fichero privado,\nno lo compartas ni subas a ningun repositorio\x1b[0m");
            process.exit(0)
        })
    })
})
