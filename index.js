const config = require('./config/config');
const { bot, Discord } = require('./config/config');
const cmysql = require('./config/mysql');
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

bot.ws.on('INTERACTION_CREATE', async interaction => {
	const command = interaction.data.name.toLocaleLowerCase();
	const channel = bot.channels.cache.get(interaction.channel_id)
	const author = bot.users.cache.get(interaction.member.user.id)
	const authbal = await cmysql.balance(author.id)
	const called = bot.commands.get(command)
	if (called) called.execute(interaction, author, channel5, config, cmysql, bot, authbal);

	/*
		TO CREATE THE COMMAND:
		bot.api.applications('860259983382544415').guilds('851966158651392040').commands.post({
			data: {
				name: "help",
				description: `Grants a complete list of commands on this bot.`,
			}
		})

		options: [
			{
				name: "words",
				description: `Words to tell people.`,
				type: 3,
				required: true
			}
    	]
		var notargs = interaction.data.options.find(arg => arg.name.toLocaleLowerCase() == "words");
        if (notargs) var args = notargs.value

		TYPES:
		1: SUB_COMMAND
		2: SUB_COMMAND_GROUP
		3: STRING
		4: INTEGER
		5: BOOLEAN
		6: USER
		7: CHANNEL
		8: ROLE
		9: MENTIONABLE (6, 7, and 8)

		choices: [
			{
				name: "Animal",
				value: `Penguin`,
			},
			{
				name: "Animal",
				value: `Dog`,
			},
    	]
		var notargs = interaction.data.choices.find(arg => arg.value.toLocaleLowerCase() == "dog");
        if (notargs) var args = notargs.value

		bot.api.interactions(interaction.id, interaction.token).callback.post({
			type: 5
      	})
		
		TYPES:
		1: Acknowledge; Send no message, but accept the interaction.
		4: Respond with a message; Requires: data:{content:``}
		5: Ackowledge and show Loading, then use type 4.

		https://discord.com/developers/docs/interactions/slash-commands#data-models-and-types
	*/
})

bot.login(config.TOKEN);