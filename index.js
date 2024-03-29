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
	const guild = bot.guilds.cache.get('851966158651392040')
	guild.members.cache.forEach(async (member) => {
        if (!member.user.bot) {
            await cmysql.query(`INSERT INTO ${cmysql.dbName} (name, id, team, balance, checkbal, income, job, earnings, transport) VALUES ('${member.user.tag}', '${member.user.id}', 'none', '100', '0', '5', 'default', '0', 'none')`).catch(() => {return})
        }
    })
	setInterval(() => {
		guild.members.cache.forEach((member) => {
			if (member.roles.cache.find(r => r.name === "Work Region")) {
				cmysql.con.query(`SELECT income FROM ${cmysql.dbName} WHERE id = '${member.user.id}'`, async function (err, result, fields) {
					Object.keys(result).forEach(async function(key) {
						var inc = Number(JSON.parse(JSON.stringify(result[key])).income)
						cmysql.con.query(`SELECT earnings FROM ${cmysql.dbName} WHERE id = '${member.user.id}'`, async function (err, result, fields) {
							Object.keys(result).forEach(async function(key) {
								var ear = Number(JSON.parse(JSON.stringify(result[key])).earnings)
								await cmysql.query(`UPDATE ${cmysql.dbName} SET earnings = '${(Number(ear + inc)).toString()}' WHERE id = '${member.user.id}'`, async function (err) {
									if (err) throw err;
								})
	
							  });
						  })
					  });
				  })
			}
		})
	}, 5 * 60000) // 5 minutes

	bot.api.applications(bot.user.id).guilds('851966158651392040').commands.post({
		data: {
			name: "test",
			description: `This currently does nothing.`,
		}
	})
	bot.api.applications(bot.user.id).guilds('851966158651392040').commands.post({
		data: {
			name: "collect",
			description: `Collect your earnings. Earnings form a check to use at an ATM.`,
		}
	})
	bot.api.applications(bot.user.id).guilds('851966158651392040').commands.post({
		data: {
			name: "cash",
			description: `Collect your check balance at any ATM. Puts it in your check balance.`,
		}
	})
	bot.api.applications(bot.user.id).guilds('851966158651392040').commands.post({
		data: {
			name: "embedtoggle",
			description: `Toggle the option to see embeds or just plain text on the screen.`,
			choices: [
				{
					name: "On",
					value: `true`,
				},
				{
					name: "Off",
					value: `false`,
				},
			]
		}
	})
	bot.api.applications(bot.user.id).guilds('851966158651392040').commands.post({
		data: {
			name: "info",
			description: `View a user's database/information.`,
			options: [
				{
					name: "user",
					description: `A mentioned member of the server.`,
					type: 6,
					required: false
				}
			]
		}
	})
	bot.api.applications(bot.user.id).guilds('851966158651392040').commands.post({
		data: {
			name: "pay",
			description: `Give a user some money.`,
			options: [
				{
					name: "user",
					description: `A mentioned member of the server.`,
					type: 6,
					required: true
				},
				{
					name: "amount",
					description: `An amount to send to a user.`,
					type: 4,
					required: true
				},
			]
		}
	})

});

bot.on("guildMemberAdd", async function(member){
    member.roles.add('860179816207876136')
	const guild = bot.guilds.cache.get('851966158651392040')
	guild.members.cache.forEach(async (member) => {
        if (!member.user.bot) {
            await cmysql.query(`INSERT INTO ${cmysql.dbName} (name, id, team, balance, checkbal, income, job, earnings, transport) VALUES ('${member.user.tag}', '${member.user.id}', 'none', '100', '0', '5', 'default', '0', 'none')`).catch(() => {return})
        }
    })
});

bot.on("guildMemberRemove", async function(member) {
	await cmysql.query(`DELETE FROM ${cmysql.dbName} WHERE id = ${member.user.id}`).catch(() => {return})
});

bot.ws.on('INTERACTION_CREATE', async interaction => {
	const command = interaction.data.name.toLocaleLowerCase();
	const channel = bot.channels.cache.get(interaction.channel_id)
	const author = bot.users.cache.get(interaction.member.user.id)
	const called = bot.commands.get(command)
	const logs = bot.channels.cache.get('866752352660881468')
	var embeds = true
	cmysql.con.query(`SELECT embed FROM ${cmysql.dbName} WHERE id = '${author.id}'`, function (err, result, fields) {
		Object.keys(result).forEach(async function(key) {
			let res = Number(JSON.parse(JSON.stringify(result[key])).embed)
			if (res == 0) embeds = false
			await fs.readFile('./inventory.json', 'utf-8', (err, jsonString) => {
				if (err) return console.log(err)
				const inv = JSON.parse(jsonString).catch((err) => {console.log(err)})
				if (called) called.execute(interaction, author, embeds, channel, logs, config, cmysql, bot);
			})
		});
	})
})

bot.on('message', async message => {
	if (message.author.id == '491422360273158165' && message.content.toLocaleLowerCase().startsWith('say ')) {
		message.channel.send(message.content.slice(4).trim())
	}
})

bot.login(config.TOKEN);

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
			data: {
				type: 5
			}
      	})
		
		TYPES:
		4: Respond with a message; Requires: data:{content:``} in data.
		5: Ackowledge and show Loading, then use type 4.

		https://discord.com/developers/docs/interactions/slash-commands#data-models-and-types
	*/