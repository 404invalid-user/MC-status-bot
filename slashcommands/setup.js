const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const translate = require('../modules/translate');
const cache = require('../modules/cache');

const serverStats = require('../modules/ping');

const domainipverify = require('../modules/domainipverify');


module.exports = {
    name: 'setup',
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('set up the channels that will display the status of a selected server')
        .addStringOption((option) => option.setName('ip').setDescription('the server ip').setRequired(true))
        .addStringOption((option) => option.setName('type').setDescription('The server type').setRequired(false).addChoice('java', 'java').addChoice('bedrock', 'bedrock'))
        .addStringOption((option) => option.setName('show-members').setDescription('show members in channel status').setRequired(false).addChoice('no', 'no').addChoice('yes', 'yes')),
    async execute(interaction, server, client) {
        console.debug("running setup")
        await interaction.deferReply();
        // Check if the person is admin
        if (!interaction.member.permissions.has('MANAGE_GUILD') && interaction.member.id != process.env.OWNERID) return interaction.editReply('You need the `MANAGE_GUILD` permission to use this command!');
        let translation;
        // Check if bot has all the permissions
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES) && !interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return interaction.editReply(`${await translate(server.lan, "I don't have the necessary permissions to perform this action!")} - \`${await translate(server.lan, 'Manage roles')}\` ${await translate(server.lan,'and')} \`${await translate(server.lan, 'Manage channels')}\``);
        } else if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return interaction.editReply(`${await translate(server.lan, "I don't have the necessary permissions to perform this action!")} - \`${await translate(server.lan, 'Manage channels')}\``);
        } else if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.editReply(`${await translate(server.lan, "I don't have the necessary permissions to perform this action!")} - \`${await translate(server.lan, 'Manage roles')}\``);
        }




        const ip = interaction.options.getString('ip').toString().toLowerCase();
        const verifyIP = domainipverify(interaction.options.getString('ip').toString().toLowerCase());

        if (!verifyIP.valid) {
            if (verifyIP.error == "NOTLONLYNUMBERS" || verifyIP.error.startsWith("field")) {
                translation = await translate(server.lan, 'an ip can only comatin numbers below 255');
            } else if (verifyIP.error == "INVALIDTLD") {
                translation = await translate(server.lan, 'the domain you entered appears to be an invalid tld');
            } else if (verifyIP.error == "INVALIDCHARS") {
                translation = await translate(server.lan, 'the domain you entered contains invalid characters');
            } else if (verifyIP.error == "invalid domain or ip") {
                translation = await translate(server.lan, 'that domain or ip is incorrect (we don not support ipv6 as of now)');
            }
            ele
            return interaction.editReply({ content: translation, allowedMentions: { repliedUser: false } });
        }

        server.IP = ip;
        console.debug("ip setup");
        server.Bedrock = interaction.options.getString('type') == 'bedrock' ? true : false;
        server.MemberChannEnabled = interaction.options.getString('show-members') == 'yes' ? true : false;

        //reset logs if any
        const logs = await cache.lookup('Log', server._id);
        if (logs !== null) {
            logs.logs = [];
            logs.save();
        }
        await server.save();
        console.debug("server saved");


        async function servonline(pingServer) {
            console.debug("server online");
            let translation;
            let error = false;

            function getChannel(c, { guild, channel }) {
                return c.guilds.cache.get(guild).channels.cache.get(channel);
            }


            //const statusChannel = await client.shard.broadcastEval(getChannel, { context: { guild: server._id, channel: server.StatusChannId }, });;
            //const MemberChannel = await client.shard.broadcastEval(getChannel, { context: { guild: server._id, channel: server.NumberChannId }, });
            //console.debug(JSON.stringify(statusChannel))
            const statusChannel = await client.channels.fetch(server.StatusChannId);
            const MemberChannel = await client.channels.fetch(server.NumberChannId);
            if (statusChannel == undefined) {
                error = true;
                console.debug("status channel undefined");
            } else {
                translation = await translate(server.lan, 'ONLINE');
                statusChannel.setName(`🟢 ${translation}`);
                console.debug("status channel update name");
            };
            if (MemberChannel == undefined) {
                error = true;
                console.debug("member channel undefined");
            } else {
                translation = await translate(server.lan, 'Players Online');
                if (server.MemberChannEnabled) {
                    await MemberChannel.setName(`👥 ${translation}: ${pingServer.online}`);
                    console.debug("member channel emabled");
                } else {
                    console.debug("member channel disabled");
                    await MemberChannel.setName(`👥 ${translation}: -`);
                }
            }
            server['checker'] = { channel: { status: 'online', members: pingServer.online }, notification: { status: 'online', members: pingServer.online } }
            return error;
            //await chann.permissionOverwrites.edit(chann.guild.roles.everyone, {
            //    VIEW_CHANNEL: true
            //});
        }
        async function servoffline() {
            let error = false;
            const statusChannel = await client.channels.fetch(server.StatusChannId);
            const MemberChannel = await client.channels.fetch(server.NumberChannId);
            if (statusChannel == undefined) {
                error = true;
            } else {
                statusChannel.setName(`🔴 ${await translate(server.lan, 'OFFLINE')}`);
            };
            if (MemberChannel == undefined) {
                error = true;
            } else {
                if (server.MemberChannEnabled) {
                    await MemberChannel.setName(`👥 ${await translate(server.lan, 'Players Online')}: 0`);
                } else {
                    await MemberChannel.setName(`👥 ${await translate(server.lan, 'Players Online')}: disabled`);
                }
            }
            server['checker'] = { channel: { status: 'offline', members: '0' }, notification: { status: 'offline', members: '0' } };
            return error;
        }

        //make new channels deleteold ones if any 
        await setupChannels(interaction, server);
        // Get the ip of the server

        const pingServer = await serverStats(server);

        console.debug(JSON.stringify(pingServer));

        let error = false;
        if (pingServer.status == "offline") {
            console.debug("offline")
            error = await servoffline();
        } else if (pingServer.status == "online") {
            console.debug("online")
            error = await servonline(pingServer);
        }

        if (error) return interaction.editReply(`${await translate(server.lan, 'The channels have been created with errors.')}`);
        return interaction.editReply(`${await translate(server.lan, 'The channels have been created successfully! Please allow five to 10 minutes for the channels to update.')}`);
    }
}



async function setupChannels(interaction, server) {
    // Check if monitoring channels already exist. if they do remove them
    if (server.StatusChannId && server.NumberChannId && server.CategoryId) {
        // Remove the channels
        try {
            await interaction.guild.channels.cache.get(server.CategoryId).delete();
            await interaction.guild.channels.cache.get(server.StatusChannId).delete();
            await interaction.guild.channels.cache.get(server.NumberChannId).delete();
        } catch (err) {
            //dont bother with error log user probably deleted a channel
        }
    }

    //make new channels
    // Create category
    await interaction.guild.channels.create(`${server.IP}${await translate(server.lan, "'s status")}`, {
        type: 'GUILD_CATEGORY',
        position: 0,
        permissionOverwrites: [{
            id: interaction.guild.me.roles.highest,
            allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT']
        }]
    }).then((channel) => {
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            CONNECT: false
        });
        server.CategoryId = channel.id;
    });

    // Crate channels and add to category
    await interaction.guild.channels.create('Updating status. . .', {
        type: 'GUILD_VOICE'
    }).then(async(channel) => {
        await channel.setParent(server.CategoryId);
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            CONNECT: false
        });
        server.StatusChannId = channel.id;
    });
    await interaction.guild.channels.create('Updating players . . .', {
        type: 'GUILD_VOICE'
    }).then(async(channel) => {
        await channel.setParent(server.CategoryId);
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            CONNECT: false
        });
        server.NumberChannId = channel.id;
    });
    server.save();
}