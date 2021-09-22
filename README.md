> **⚠ AVISO ⚠**  
> La explicación de la situación está en se puede encontrar [aquí](https://youtu.be/WhJ21pJ-IRQ). El bot ya no se encuentra en funcionamiento. Podeis hacer un fork de este repositorio y crear vuestros propios bots para seguir con la esencia de Node 😄


<img width="150" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="🤖 Node" src="https://i.goopics.net/52j27r.jpg">  

# Node

[![⭐ GitHub](https://img.shields.io/github/stars/LyricalString/Node.svg?style=social&label=Stars&style=flat)](https://github.com/LyricalString/Node/stargazers)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=LyricalString_probando&metric=ncloc)](https://sonarcloud.io/dashboard?id=LyricalString_probando)
[![](https://img.shields.io/badge/discord.js-v13.0.0--dev-blue.svg?logo=npm)](https://github.com/discordjs)
[![DevServer](https://discordapp.com/api/guilds/834440041010561074/widget.png?style=shield)](https://discord.gg/SbsFVV5dNG)
[![](https://img.shields.io/github/languages/top/LyricalString/Node)]()

> Este bot fue usado por más de 3.000.000 usuarios de Discord y más de 28.000 servidores.

Node es un bot multifunción, multilenguaje, programado en [Discord.js](https://discord.js.org) y [Mongoose](https://mongoosejs.com/docs/api.html) por [LyricalString](https://github.com/LyricalString).  
¡Añade una ⭐ al repositorio para promocionar el proyecto!

## Requisitos

1. Token de Discord Developers **[Guía](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
2. Java (para ejecutar Lavalink del módulo de música)
3. Node.js v16.0.0 o una más reciente.


## 🚀 Guía de Instalación

```sh
git clone https://github.com/LyricalString/Node
cd Node
npm install
```

⚠️ Luego de la instalación, antes de ejecutar `node index.js` y `java -jar Lavalink2.jar`, deberás de crear un archivo `.env` y añadir las credenciales tal como se muestra más abajo. 

## ⚙️ Configuración

Siguiendo el formato más abajo, deberás de crear un archivo llamado `.env` para añadir las credenciales.

⚠️ **Nota: Nunca publiques o muestres tu token o las claves de API's públicamente** 

```json
mode = "[development/production]"
token = "token del bot"
lang = "[es_ES/en_US]"
prefix = "prefijo predefinido"
botID = "id del usuario bot"
MONGO_URL =  "url de Mongo para que se conecte el bot"
EMBED_COLOR = "color predefinido para los embeds"
errorWebhookID = "id del webhook donde se enviarán los errores"
errorWebhookToken = "token del webhook donde se enviarán los errores"
errorChannel = "id del canal de errores"
topggToken = "token de topGG"
clientIDSpotify = "id del cliente de Spotify"
clientSecretSpotify = "token del cliente de Spotify"
guildAddWebhookID = "id del webhook donde se enviarán las notificaciones para nuevos servidores"
guildAddWebhookToken = "token del webhook donde se enviarán las notificaciones para nuevos servidores"
OsuSecret = "clave API para OSU"
trnAPIKey = "clave API para TRN (comando de fnprofile)"
```
🚨 **Como mínimo deberás de rellenar hasta el MONGO_URL para poder iniciarlo, el resto te darán error los comandos que lo usen.** 🚨



## 🛠️ Características

### Bot completo

Lista de funciones:
*   ✉️ Prefijo global o prefijo por servidor, además de la propia mención al bot.
*   🇪🇸 Multilenguaje (Español e Inglés)
*   ⚙️ Configuración en Mongo por servidor (prefijo, canales de escucha, etc...)
*   😀 Comandos únicos en embeds



### Categorías de comandos

Node tiene más de 100 comandos repartidos en  **7 categorías**:

*   👩‍💼 **Administración**
*   🛡 **Moderación**
*   🎵 **Música**
*   😂 **Diversión**
*   🚩 **Información y Utilidades**
*   🫂 **Interacción**
*   💻 **Desarrollo** (Comandos que estaban en desarrollo, sin acabar)

## 📎 Links

*   [Discord](https://discord.gg/SbsFVV5dNG)
*   [Github](https://github.com/LyricalString)

## 🤝 Contribuciones

Antes de **reportar un error**, por favor asegúrate de que no ha sido reportado/sugerido anteriormente.   
Si tienes cualquier duda, pregúntanosla en el [servidor de Discord](https://discord.gg/SbsFVV5dNG) en vez de crear un reporte.
Si quieres contribuir, siéntete libre de bifurcar el repositorio y solicitar una pull request.

## 📝 Créditos

* [@amadeusgray](https://github.com/amadeusgray) Por ser mi mano derecha en el proyecto.
* [@soyultro](https://github.com/SoyUltro) Por la ayuda creando comandos y el multilenguaje.
* [@didacus12](https://github.com/Didacus12) Por tu ayuda en el desarrollo del bot.
* [@usarral](https://github.com/usarral) Por tus aportes en Node.
* [@andressantamaria2003](https://github.com/andressantamaria2003) Por prestarnos tu ayuda desde el hosting hasta en la seguridad de Node.

## 📜 Licencia

Node esta licenciado bajo la licencia GPL 3.0. Revisa el archivo `LICENSE` para más información. Si planeas usar cualquier parte de este código base en tu propio bot, estaría agradecido si se me incluyese en los créditos.