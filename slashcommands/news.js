const axios = require('axios');
const Discord = require('discord.js');
const parser = require('fast-xml-parser');
const translate = require('../modules/translate');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'news',
    data: new SlashCommandBuilder().setName('news').setDescription('see the latest articles from minecraft.net'),
    async execute(interaction) {
        // Get the xml, we emulate a browser by including the user-agent header
        try {
            const data = await axios.get('https://www.minecraft.net/en-us/feeds/community-content/rss', {
                headers: {
                    httpHeader: 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'
                }
            });

            const feed = parser.parse(data.data.toString());

            const embed = new Discord.MessageEmbed()
                .setColor('#008000')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/265/newspaper_1f4f0.png')
                .setTitle('The latest news: ')
                .setDescription('The latest articles posted on [minecraft.net](https://www.minecraft.net/) \nYou can read them in full there. \n‎‎ ‎')
                .addFields({
                    name: '1. ' + feed.rss.channel.item[0].title,
                    value: feed.rss.channel.item[0].description + '\n → *' + feed.rss.channel.item[0].pubDate.split(' ', 4).join(' ') + '*'
                }, {
                    name: '2. ' + feed.rss.channel.item[1].title,
                    value: feed.rss.channel.item[1].description + '\n → *' + feed.rss.channel.item[1].pubDate.split(' ', 4).join(' ') + '*'
                }, {
                    name: '3. ' + feed.rss.channel.item[2].title,
                    value: feed.rss.channel.item[2].description + '\n → ‎*' + feed.rss.channel.item[2].pubDate.split(' ', 4).join(' ') + '*'
                }, {
                    name: '4. ' + feed.rss.channel.item[3].title,
                    value: feed.rss.channel.item[3].description + '\n → *' + feed.rss.channel.item[3].pubDate.split(' ', 4).join(' ') + '*'
                });
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            interaction.reply('Uh oh, an error occurred while trying to fetch the news! Try again later!');
            return;
        }
    }
}