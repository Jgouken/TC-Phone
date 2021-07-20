module.exports = {
    name: `embedtoggle`,

    async execute(interaction, author, embeds, channel, logs, config, cmysql, bot) {
        var off;
        if (interaction.data.choices) off = interaction.data.choices.find(arg => arg.name.toLocaleLowerCase() == "Off");
        if (((off) && embeds) || (!interaction.data.choices && embeds)) {
            await cmysql.query(`UPDATE ${cmysql.dbName} SET embed = false WHERE id = '${author.id}'`)
            bot.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                  type: 4,
                  data: {
                      flags: 1 << 6,
                      content: `👍 Done! All embeds on this bot just for you have been removed!\n**Warning:** This may cause formatting issues not present in embeds.`
                  }
                }
              })
        } else {
            await cmysql.query(`UPDATE ${cmysql.dbName} SET embed = true WHERE id = '${author.id}'`)
            bot.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                  type: 4,
                  data: {
                      flags: 1 << 6,
                      embeds: [
                          {
                            title: `Embeds On! 👍`,
                            description: `Done! Back to the ol' days! All embeds on this bot just for you have been added back!`
                          }
                        ]
                  }
                }
              })
        }

    }
}