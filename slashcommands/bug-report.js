const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Modal, TextInputComponent, showModal } = require('discord-modals') // Modal and TextInputComponent class

const errorForm = new Modal()
    .setCustomId('bug-report')
    .setTitle('Report Bug!')
    .addComponents(
        new TextInputComponent()
        .setCustomId('time')
        .setLabel('time and date it happened (with timezone)')
        .setStyle('SHORT')
        .setMinLength(4)
        .setMaxLength()
        .setPlaceholder('1st apr 2022 12:00 GMT')
        .setRequired(true),
        new TextInputComponent()
        .setCustomId('description')
        .setLabel('description of the bug what happened.')
        .setStyle('LONG')
        .setMinLength(10)
        .setMaxLength(2000)
        .setPlaceholder('i went to report a bug and it didnt work')
        .setRequired(true),
        new TextInputComponent()
        .setCustomId('desired-output')
        .setLabel('what was meant to happen?')
        .setStyle('LONG')
        .setMinLength(10)
        .setMaxLength(2000)
        .setPlaceholder('bot will thank me for reporting bug with a reference id')
        .setRequired(true),
        new TextInputComponent()
        .setCustomId('output')
        .setLabel('what did happen?')
        .setStyle('LONG')
        .setMinLength(10)
        .setMaxLength(2000)
        .setPlaceholder('bot didn\'t thank me and it made me sad')
        .setRequired(true)
    );


module.exports = {
    name: 'bug-report',
    data: new SlashCommandBuilder()
        .setName('bug-report')
        .setDescription('Report a bug in the bot or website.'),
    execute(interaction, server, client) {
        showModal(errorForm, {
            client: client,
            interaction: interaction
        });
    }
}