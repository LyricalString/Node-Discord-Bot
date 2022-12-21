const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/Commandos.js')
const { sendError } = require('../../utils/utils.js')

module.exports = class MineSweeper extends Command {
    constructor() {
        super({
            name: 'minesweeper',
            description: ['Time to play the minesweeper.', 'Es hora de jugar al buscaminas.'],
            cooldown: 150,
            alias: ['buscaminas'],
            category: 'Diversion',
            inactive: true
        })
    }
    async run(message, args, prefix) {
        try {
            //buscaminas by eliyya
            //se definen las filas, columnas y bombas
            const filas = 9,
                columnas = 9
            let bombas = 15
            //se crea una matriz de 9x9
            const matriz = Array.from({ length: filas }, () => new Array(columnas).fill(0))
            //se colocan bombas aleatoriamente
            while (bombas--) {
                let filaRandom = Math.floor(Math.random() * filas)
                let columnaRandom = Math.floor(Math.random() * columnas)
                //si la posicion ya tiene bomba se genera otra
                while (matriz[filaRandom][columnaRandom] == 9) {
                    filaRandom = Math.floor(Math.random() * filas)
                    columnaRandom = Math.floor(Math.random() * columnas)
                }
                //se añade la bomba = 9
                matriz[filaRandom][columnaRandom] = 9
            }
            //recorremos todas las casillas para colocar los mumeros
            for (let x = 0; x < filas; x++)
                for (let y = 0, c = 0; y < columnas; matriz[x][y] ||= c, c = 0, y++)
                    if (matriz[x][y] != 9)
                        for (let i = -1; i < 2; i++) for (let j = -1; j < 2; j++) if (matriz[x + i]?.[y + j] === 9) c++
            //creamos los emojis que remplazarán los muneros
            const choices = [
                '||:zero:||',
                '||:one:||',
                '||:two:||',
                '||:three:||',
                '||:four:||',
                '||:five:||',
                '||:six:||',
                '||:seven:||',
                '||:eight:||',
                '||:bomb:||'
            ]
            //inicializamos el mensaje
            let buscaminas = ''
            //recorremos x y y para crear el mensaje
            for (let x = 0; x < matriz.length; buscaminas += '\n', x++)
                for (let y = 0; y < matriz[0].length; y++) buscaminas += `${choices[matriz[x][y]]} `

            //terminando el ciclo entero se envia el mensaje
            message.reply(buscaminas)
        } catch (e) {
            sendError(e, message)
        }
    }
}
