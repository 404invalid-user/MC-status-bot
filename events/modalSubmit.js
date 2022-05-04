const logger = require('../modules/nodeLogger.js');
const axios = require('axios');
const Discord = require('discord.js')

module.exports = {
    name: 'modalSubmit',
    async execute(modal, client) {
        // Check if user is rate limited
        const limited = client.rateLimiter.take(modal.member.id);
        if (limited) return;

        if (modal.customId === 'bug-report') {
            let bugId = '000';
            const time = modal.getTextInputValue('time');
            const description = modal.getTextInputValue('description');
            const desiredOutput = modal.getTextInputValue('desired-output');
            const output = modal.getTextInputValue('desired-output');
            await axios.post('https://faq.mcstatusbot.site/bug', {
                user: modal.member.id,
                owner: process.env.OWNERID,
                bot: {
                    id: client.user.id,
                    name: client.user.tag,
                    avatar: client.user.displayAvatarURL({ dynamic: true })
                },
                bug: {
                    time: time,
                    description: description,
                    desiredoutput: desiredOutput,
                    output: output
                }
            }).then(res => {
                bugId = res.data.id;
            }).catch(err => {
                logger.error(err.stack || err);
            });

            const owner = await client.users.fetch(process.env.OWNERID);

            if (owner != undefined) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('New Bug report!')
                    .setDescription("track the status at https://faq.mcstatusbot.site/bug?id=" + bugId)
                    .addField('__**ID:**__', bugId)
                    .setThumbnail()
                    .setTimestamp()
                owner.send({ embeds: [embed] })
            }
            return modal.reply("Thank you for reporting this bug!\nhere is your reference id: `" + bugId + "`, you can track the status at https://faq.mcstatusbot.site/\nThe maintainer and owner of this bot instance have received the bug report.")
        }

    }
}