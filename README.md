:warning: warning: no longer maintined and has many bugs please take a look at v3 here [org:MCStatusBot](https://github.com/MCStatusBot)

# MC status bot :robot: :chart_with_upwards_trend:

[![Discord Bot status](https://top.gg/api/widget/status/816747912888975362.svg)](https://top.gg/bot/816747912888975362)
[![Discord Bots](https://top.gg/api/widget/servers/816747912888975362.svg) ](https://top.gg/bot/816747912888975362)

<br>

Let everyone in your Discord server quickly see the status of a minecraft server:

![img1](https://i.ibb.co/kQ05Pjx/example1.png)

Create graphs, and log the status of a server:

![img2](https://i.ibb.co/grR1NY9/chartex.png)

### :arrow_right: **[Add this bot to your server](https://discord.com/oauth2/authorize?client_id=816747912888975362&permissions=269798480&scope=bot%20applications.commands)**

## *Commands*

**Admin command:**

`/language` change the bots language.

`/log` Turn logging on or off. 

`/setip` Set the ip that will be monitored. You can use this command to change the ip at any time.

`/setup` Create the two channels that will display the server status.

`/rmchann` Removes the monitoring channels

<br>

**Normal commands:**

`/help` List all the commands and what they do.

`/ping` Ping a specified ip. You can use the command with no arguments to ping the ip specified by using the `/setip` command.

`/chart uptime` Create a chart of players online over time on the server.

`/chart playersonline` Create a chart of server uptime and calculate the uptime percentage.

`/chart mostactive` Create a bar chart with the number of minutes each player spent on th server.

`/news` Get the latest articles from minecraft.net

`/ip` Return the default ip of the guild

`/bug` Report a bug in the bot

<br>

## f&Q

- **slash commands arent working**
 - have you got permission to use them? ask the server admin
 - has the bot got permission to add them? kick then readd the bot with this [invite link](https://discord.com/oauth2/authorize?client_id=816747912888975362&scope=bot&permissions=268749904)

- **my status channel(s) aren't updating**
 - if your members channel is not updating this is disabled by default please resetup the bot bu doing `/setup` and make sure you select `yes` on the `show-members` option
 - if they both arent updating due to [this see message link](https://discord.com/channels/892122095235006485/892124170115239937/939299623447719989) channels are only set to upate if they have changed and when  someone sends a message in the server so if your server is inactive the channels will not update unless you send a message

<br>

## :information_source: *Notes and additional info*
* Logging is turned off by default! You can turn it on by using the `mc!log` command.
* The bot logs the status of the server every 5 minutes and it keeps 24 hours of logs. 
* When the bot leaves a server all logs and info connected to that servers guild id will be deleted.
* Have questions? Join the [Support server](https://discord.gg/YzX5KdF4kq) and ask.

<br>

## *Maintainers*

This project is currently maintained by:
* [@404invalid-user](https://github.com/404invalid-user)
retired/inactive:
* [@Cappig](https://github.com/cappig)

<br>
<hr>

* Read the privacy policy [here.](https://github.com/404invalid-user/MC-status-bot/blob/main/miscellaneous/Privacy_policy.md)
* The profile picture for this bot is based on the computer from the [ComputerCraft mod](https://www.computercraft.info/). The original picture can be found [here](https://feed-the-beast.fandom.com/wiki/ComputerCraft?file=Iso_Computer.png). The original image is licensed under the Creative Commons Attribution-Share Alike License, thus the [modified image](https://github.com/404invalid-user/MC-status-bot/blob/main/miscellaneous/icon.png) is licensed under the same [license](https://creativecommons.org/licenses/by-sa/3.0/).


## build


go to [/build.md](/build.md)
