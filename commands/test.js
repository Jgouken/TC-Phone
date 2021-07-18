const Discord = require('discord.js');
const bot = new Discord.Client();

bot.api.applications('815272046060634112').guilds('815099824491724801').commands.post({
    data: {
      name: "test",
      description: `A test command to give the author +$1.`,
    }
})

module.exports = {
    name: `test`,

    execute(interaction, author, channel, config, cmysql, bot, authbal) {
        cmysql.set(message.author.id, 'balance', (authbal + 1))
        bot.api.interactions(interaction.id, interaction.token).callback.post({
			type: 1,
      	})
    }
}
