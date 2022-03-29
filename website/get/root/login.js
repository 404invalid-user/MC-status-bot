const path = require('path')
const logger = require('../../../modules/nodeLogger')
const dbc = require('discord-bitfield-calculator')

const User = require('../../../database/user')
const cache = require('../../../modules/cache')
const rS = require('randomstring')

const axios = require('axios')

module.exports = {
    path: '/login',

    async run(shards, req, res) {
        try {
            if (req.query.code) {
                let oath
                let userInfo
                let userGuilds = []
                let botGuilds = []
                let guilds = []
                let randomString = rS.generate({
                    length: 33,
                    charset: 'alphabetic'
                })

                const tokenData = new URLSearchParams()
                tokenData.append('client_id', process.env.client_id)
                tokenData.append('client_secret', process.env.client_secret)
                tokenData.append('grant_type', 'authorization_code')
                tokenData.append('redirect_uri', process.env.redirect_uri)
                tokenData.append('code', req.query.code)
                tokenData.append('scope', 'identify email guilds')

                await axios
                    .post('https://discord.com/api/oauth2/token', tokenData.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                    .then((responce) => (oath = responce.data))
                    .catch((err) => {
                        logger.error(err.stack || err)
                        if (err.toString() == 'Error: Request failed with status code 400') {
                            return res.redirect('/login?ref=code-fail')
                        }
                    })
                await axios
                    .get('https://discord.com/api/users/@me', { headers: { authorization: `${oath.token_type} ${oath.access_token}` } })
                    .then((responce) => (userInfo = responce.data))
                    .catch((err) => {
                        logger.error(err.stack || err)
                    })
                await axios
                    .get('https://discord.com/api/users/@me/guilds', { headers: { authorization: `${oath.token_type} ${oath.access_token}` } })
                    .then((responce) => (userGuilds = responce.data))
                    .catch((err) => {
                        logger.error(err.stack || err)
                    })

                // the access code was used/expired try use cookeis
                if (userInfo.message == '401: Unauthorized' || userGuilds.message == '401: Unauthorized') return res.redirect('/dashboard')

                let botShardGuilds = await shards.broadcastEval((bot) => bot.guilds.cache.map((guild) => guild.id))

                //loop thought the array or arrays of guild ids and push it to one array
                for (let i = 0; i < botShardGuilds.length; i++) {
                    for (let a = 0; a < botShardGuilds[i].length; a++) {
                        await botGuilds.push(botShardGuilds[i][a])
                    }
                    //manual garbage collection
                    if (i == botShardGuilds.length) {
                        delete botShardGuilds
                    }
                }

                //loop though oauth2 guilds and push guild info for matching guilds to 'guilds' array

                for await (const userGuild of userGuilds) {
                    guilds.push({
                        _id: userGuild.id,
                        mutual: botGuilds.includes(userGuild.id) ? true : false,
                        manage: dbc.permissions(userGuild.permissions_new).includes('MANAGE_GUILD') ? true : false
                    })
                }
                delete botGuilds
                let currentUser = await cache.lookup('user', userInfo.id).catch((e) => { })
                if (currentUser == null) {
                    await User.create({
                        _id: userInfo.id,
                        username: userInfo.username,
                        discriminator: userInfo.discriminator,
                        avatar: `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`,
                        accessCodes: [{ browser: req.headers['user-agent'], code: randomString }],
                        guilds: guilds
                    })
                    currentUser = await cache.lookup('user', userInfo.id).catch((e) => { })
                } else {
                    let gotCorrectAccessCode = false
                    if (res.locals.cookie.accesscode) {
                        await currentUser.accessCodes.forEach(async (accessCode) => {
                            if (res.locals.cookie.accesscode == accessCode.code) {
                                gotCorrectAccessCode = await true
                                randomString = res.locals.cookie.accesscode
                            }
                        })
                    }
                    if (gotCorrectAccessCode == false) {
                        currentUser.accessCodes.push({ browser: req.headers['user-agent'], code: randomString })
                    }
                    currentUser.userName = userInfo.username
                    currentUser.avatar = `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
                    currentUser.guilds = guilds
                    currentUser.save()
                }
                cache.removeCache('user', currentUser._id)
                cache.createCache('user', currentUser._id, currentUser)

                res
                    .cookie('id', currentUser._id, { expires: new Date(253402300000000), httpOnly: true })
                    .cookie('token', randomString, { expires: new Date(253402300000000), httpOnly: true })
                    .status(200)
                    .redirect('/')
            } else if (req.query.error) {
                logger.error('req query error: ' + req.query.error)
                return res.status(500)
            } else {
                return res.redirect(
                    `https://discord.com/api/oauth2/authorize?client_id=${process.env.client_id}&redirect_uri=${process.env.redirect_uri}&response_type=code&scope=identify%20email%20guilds`
                )
            }
        } catch (error) {
            logger.error(error.stack || error)
            return res.status(500)
        }
    }
}
