const { SlashCommandBuilder } = require('@discordjs/builders')
const translate = require('../modules/translate')
const cache = require('../modules/cache.js')

module.exports = {
    name: 'language',
    data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('sets the bots language iso for your server'),
    async execute(interaction, server) {
        let replyContent = '';
        // Check if the person is admin
        if (!interaction.member.permissions.has('MANAGE_GUILD') && interaction.member.id != process.env.OWNERID) {
            replyContent = await translate(server.lan, 'You need the `MANAGE_GUILD` permission to use this command!');
            return interaction.reply(replyContent);
        }
        args = interaction.options.getString('language');
        const lan = await cache.lookup('lan', args.toLowerCase());
        if (lan == null) {
            replyContent = await translate(server.lan, 'that is not a valid language iso we support, for a list please see');
            return interaction.reply(replyContent);
        }
        if (!server.IP || server.IP == '' || server.IP == ' ') {
            replyContent = await translate(server.lan, 'there is no ip set use `/setup` to set an ip');
            return interaction.reply(replyContent + " https://docs.mcstatusbot.site/language/list");
        }

        server.lan = lan.iso;
        await server.save();
        replyContent = await translate(server.lan, 'language has been set');
        return interaction.reply(replyContent);
    }
}
