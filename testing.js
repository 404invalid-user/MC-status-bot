const puppeteer = require('puppeteer');
const fs = require('fs')
const Discord = require('discord.js')

module.exports = async (message, args) => {
    message.channel.send("please wait")
    console.log(args)
    let x = args[0], y = '3', z = args[1];
    let bluemapurl = 'http://snekmc.schost.us:8100/';
  const browser = await puppeteer.launch({ headless: false });
  //http://snekmc.schost.us:8100/#world:-32:2:-32:100:0:0.89:0:0:perspective
  const page = await browser.newPage();
  const world = 'world'
  const x = '-32'
  const y = '2'
  const z = '-32'
  const distance = '100'
  const rotation = '0'
  const angle = '0.89'
  const tilt = '0'
  const ortho = '0'
  const mode = 'perspective'
  await page.setDefaultNavigationTimeout(0); 
  await page.goto(`${bluemapurl}#${world}:${x}:${y}:${z}:${distance}:${rotation}:${angle}:${tilt}:${ortho}:${mode}`);
  //await page.goto(`${bluemapurl}#world:${z}:${y}:${z}:0:-0.02:0:0:0:free`);
  
  setTimeout(async ()=> {

    await page.screenshot({ path: 'example.png' });

    await browser.close();
    const attachment = new Discord.MessageAttachment('./example.png');
    message.reply({ content: "map", files: [attachment] });
  }, 20000)

};