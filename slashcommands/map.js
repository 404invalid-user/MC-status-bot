const { SlashCommandBuilder } = require('@discordjs/builders')
const translate = require('../modules/translate')
const puppeteer = require('puppeteer')
const fs = require('fs')
const Discord = require('discord.js')
const uniqid = require('uniqid')
module.exports = {
  name: 'map',
  data: new SlashCommandBuilder()
    .setName('map')
    .setDescription('view your minecraft map using the bluemap plugin')
    .addStringOption((option) => option.setName('world').setDescription('the world you want to view (default: world)').setRequired(true))
    .addStringOption((option) => option.setName('x').setDescription('your x coordinate').setRequired(true))
    .addStringOption((option) => option.setName('y').setDescription('your y coordinate').setRequired(true))
    .addStringOption((option) => option.setName('z').setDescription('your z coordinate').setRequired(true))
    .addStringOption((option) =>
      option
        .setName('direction')
        .setDescription('the direction you would like to face')
        .setRequired(true)
        .addChoice('N', 'N')
        .addChoice('E', 'E')
        .addChoice('S', 'S')
        .addChoice('W', 'W')
        .addChoice('NE', 'NE')
        .addChoice('SE', 'SE')
        .addChoice('NW', 'NW')
    ),
  async execute(interaction, server, client) {
    return interaction.reply('still in dev check on the progress in out discord server')
    const world = 'world'
    const x = interaction.options.getString('x')
    const y = '0' //just use 0 blue map will do the rest for us
    const z = interaction.options.getString('z')
    const distance = '100'
    let rotation = '0'
    const angle = '0.89'
    const tilt = '0'
    const ortho = '0'
    const mode = 'perspective'

    const direction = interaction.options.getString('direction')
    if (direction == 'N') {
      rotation = '0'
    } else if (direction == 'NE') {
      rotation = '-1'
    } else if (direction == 'E') {
      rotation = '-1.50'
    } else if (direction == 'SE') {
      rotation = '-2.50'
    } else if (direction == 'S') {
      rotation = '-3'
    } else if (direction == 'NW') {
      rotation = '-4'
    } else if (direction == 'W') {
      rotation = '1.5'
    }
    if (!server.bluemapurl) {
      return interaction.reply('you have not setup your blue map url. please install the bluemap plugin then ender the full url on the dashboard')
    }
    let bluemapurl = 'http://snekmc.schost.us:8100/'
    interaction.reply('please wait for the map to load. i will ping you when im done')

    const browser = await puppeteer.launch({ headless: false })
    const filesaveuid = uniqid()
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.goto(`${server.bluemapurl}#${world}:${x}:${y}:${z}:${distance}:${rotation}:${angle}:${tilt}:${ortho}:${mode}`)
    setTimeout(async () => {
      await page.screenshot({ path: filesaveuid + '.png' })
      await browser.close()
      //saving the file just in the cmds folder is so messy but quick go brrr
      const attachment = new Discord.MessageAttachment(`./${filesaveuid}.png`)
      interaction.channel.send({ content: '<@!' + interaction.member.id + '>', files: [attachment] })
      fs.unlinkSync('./' + filesaveuid + '.png')
    }, 55000)
  }
}
