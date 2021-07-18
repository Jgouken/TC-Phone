const config = require('./config/config');
const { bot, Discord } = require('./config/config');
const cmysql = require('./config/mysql');
const { mysql, con } = require('./config/mysql')
const fs = require('fs')
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

bot.on('ready', async () => {
	if (config.stop == true) return console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE, BUT IS STOPPED!\n\n`);
	console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE!\n\n`);
});

bot.on("guildMemberAdd", async function(member){
    member.roles.add('860179772202156053')
	await cmysql.addUsers(bot.guilds.cache.get('851966158651392040'))
});

bot.on("guildMemberRemove", async function(member){
    await cmysql.removeUser(member.user.id)
	await cmysql.addUsers(bot.guilds.cache.get('851966158651392040'))
});

bot.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type == 'dm') return;
	if (!message.content.toLocaleLowerCase().startsWith(config.prefix.toLocaleLowerCase())) return;
	if (!(message.guild.me).hasPermission("SEND_MESSAGES")) return;

	const commandArgs = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = commandArgs.shift().toLowerCase();
	const called = bot.commands.get(command)
	if (called) called.execute(message, commandArgs, config, cmysql, bot);
})

bot.login(config.TOKEN);