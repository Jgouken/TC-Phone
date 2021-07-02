const config = require('./config/config')
const {bot, Discord} = require('./config/config')
const fs = require('fs')
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

bot.on('ready', async () => {
  console.log(`\n\n${config.name} IS ONLINE!\n\n`);
  bot.user.setPresence({
    status: 'online',
    activity: {
      name: `${config.prefix}test`,
      type: 'WATCHING',
    }
  })
  
    bot.on('message', async message => {
        if (message.author.bot) return;
        if (message.channel.type == 'dm') return;
        if (!message.content.toLocaleLowerCase().startsWith(config.prefix)) return;
        if (!(message.guild.me).hasPermission("SEND_MESSAGES")) return;

        const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
        if (bot.commands.get(command)) called.execute(message, commandArgs, config, bot)

    })
})

bot.login(config.TOKEN)