let atms = [
    '860045733805555712',
    '860045698636840960',
    '860045795248308296'
]

module.exports = {
    name: `cash`,

    execute(interaction, author, embeds, channel, logs, config, cmysql, bot) {
        var ear = undefined

        if (!atms.includes(channel.id) && channel.id != '860045038943338548') return bot.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: 'You must be at an ATM to cash your check!',
                    flags: 1 << 6
                }
            }
        })
        cmysql.con.query(`SELECT * FROM ${cmysql.dbName} WHERE id = '${author.id}'`, async function (err, result, fields) {
            Object.keys(result).forEach(async function(key) {
                if (channel.id == '860045038943338548') ear = Number(Math.floor(Number(JSON.parse(JSON.stringify(result[key])).checkbal) * Number(0.8)));
                else ear = Number(JSON.parse(JSON.stringify(result[key])).checkbal)
                if (ear <= 0) {
                    if (embeds) {
                        bot.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    embeds: [
                                        {
                                            title: `You don't have anything to cash!`,
                                            description: `There's currently no money in your check balance!`
                                        }
                                    ],
                                    flags: 1 << 6
                                }
                            }
                        })
                    } else {
                        bot.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: `There's currently no money in your check balance!`,
                                    flags: 1 << 6
                                }
                            }
                        })
                    }
                }

                bal = Number(JSON.parse(JSON.stringify(result[key])).balance)
                await cmysql.query(`UPDATE ${cmysql.dbName} SET balance = '${(Number(ear + bal))}' WHERE id = '${author.id}'`)
                await cmysql.query(`UPDATE ${cmysql.dbName} SET checkbal = '0' WHERE id = '${author.id}'`)

                if (embeds) {
                    bot.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                embeds: [
                                    {
                                        title: `**$${ear.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** put in your balance!`,
                                        description: `**$${ear.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** has been put into a balance.`
                                    }
                                ],
                                flags: 1 << 6
                            }
                        }
                    })
                } else {
                    bot.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                content: `**$${ear.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** has been put into your balance.`,
                                flags: 1 << 6
                            }
                        }
                    })
                }

                logs.send({
                    embed: {
                        title: `${author.tag} used **/cash**`,
                        description: `${author.username} cashed a check of **$${ear.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**.`,
                        thumbnail: {
                            url: `${author.avatarURL()}?size=1024`
                        },
                        timestamp: new Date(),
                        footer: {
                            text: `Alias: ${channel.guild.members.cache.get(author.id).nickname || "(none)"}`
                        }
                    }
                })
              });
          })
    }
}