const { readFile, writeFile } = require('fs')
const stdin = process.openStdin()

function token({ env = 'mode=development\n', envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa el token del bot:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}token=${data || envVals.find((i) => i.prop === 'token')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function prefix({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Establece un prefijo por defecto:')
        console.log('! (por default)')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            if (data.length > 0)
                return resolve({
                    env: `${env}prefix=${data}\n`,
                    envVals
                })
            return resolve({
                env: `${env}prefix=${envVals.find((i) => i.prop === 'prefix')?.value || '!'}\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function mongoURL({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa la URL de tu MongoDB:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}MONGO_URL=${data || envVals.find((i) => i.prop === 'MONGO_URL')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function embedColor({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Establece un color preferido para los embeds:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}EMBED_COLOR=${data || envVals.find((i) => i.prop === 'EMBED_COLOR')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function errorWebhookURL({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa el URL del WebHook de errores:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}errorWebhookURL=${
                    data || envVals.find((i) => i.prop === 'errorWebhookURL')?.value || ''
                }\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function errorChannel({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa el ID del canal de errores:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}errorChannel=${data || envVals.find((i) => i.prop === 'errorChannel')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function topggToken({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa tu token de topGG:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}topggToken=${data || envVals.find((i) => i.prop === 'topggToken')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function clientIDSpotify({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa el ID del cliente de Spotify:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}clientIDSpotify=${
                    data || envVals.find((i) => i.prop === 'clientIDSpotify')?.value || ''
                }\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function clientSecretSpotify({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa el token del cliente de Spotify:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}clientSecretSpotify=${
                    data || envVals.find((i) => i.prop === 'clientSecretSpotify')?.value || ''
                }\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function guildAddWebhookURL({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log(
            '\x1b[32m%s\x1b[0m',
            'Ingresa el URL del webhook donde se enviarán las notificaciones para nuevos servidores:'
        )
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}guildAddWebhookURL=${
                    data || envVals.find((i) => i.prop === 'guildAddWebhookURL')?.value || ''
                }\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function OsuSecret({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa la clave API para OSU:')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}OsuSecret=${data || envVals.find((i) => i.prop === 'OsuSecret')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}

function trnAPIKey({ env, envVals = [] }) {
    return new Promise((resolve) => {
        console.log('\x1b[32m%s\x1b[0m', 'Ingresa la clave API para TRN (comando de fnprofile):')
        const onData = (data) => {
            data = data.toString().replaceAll('\n', '').replaceAll('\r', '')
            stdin.removeListener('data', onData)
            return resolve({
                env: `${env}trnAPIKey=${data || envVals.find((i) => i.prop === 'trnAPIKey')?.value || ''}\n`,
                envVals
            })
        }
        stdin.addListener('data', onData)
    })
}
readFile('./.env', (err, data) => {
    if (err && err.code !== 'ENOENT') return console.log(err)
    const envVals = (data ?? '')
        .toString()
        .split('\n')
        .filter(Boolean)
        .map((i) => ({
            prop: i.split('=')[0],
            value: i.split('=')[1]
        }))
    token({ envVals })
        .then(prefix)
        .then(mongoURL)
        .then(embedColor)
        .then(errorWebhookURL)
        .then(errorChannel)
        .then(topggToken)
        .then(clientIDSpotify)
        .then(clientSecretSpotify)
        .then(guildAddWebhookURL)
        .then(OsuSecret)
        .then(trnAPIKey)
        .then(({ env }) => {
            writeFile('./.env', env, (err) => {
                if (err) return console.error(err)
                console.log('\x1b[35m%s\x1b[0m', '.env creado')
                console.log('\x1b[31m%s\x1b[0m', 'Importante:')
                console.log(
                    '\x1b[33mEl .env es un fichero privado,\nno lo compartas ni subas a ningun repositorio\x1b[0m'
                )
                process.exit(0)
            })
        })
})
