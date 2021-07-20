module.exports = {
    name: `collect`,

    execute(interaction, author, embeds, channel, logs, config, cmysql, bot) {
        var ear = undefined
        const guild = channel.guild
        const member = guild.member(author.id)
        if (!member.roles.cache.find(r => r.name === "Work Region")) return bot.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: 'You must be in the Work Region in order to collect your earnings!',
                    flags: 1 << 6
                }
            }
        })
        cmysql.con.query(`SELECT * FROM ${cmysql.dbName} WHERE id = '${author.id}'`, async function (err, result, fields) {
            Object.keys(result).forEach(async function(key) {
                ear = Number(JSON.parse(JSON.stringify(result[key])).earnings)

                if (ear <= 0) {
                    if (embeds) {
                        bot.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    embeds: [
                                        {
                                            title: `You don't have anything to collect!`,
                                            description: `There's currently no money in your earnings!`
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
                                    content: `There's currently no money in your earnings!`,
                                    flags: 1 << 6
                                }
                            }
                        })
                    }
                }

                cb = Number(JSON.parse(JSON.stringify(result[key])).checkbal)
                await cmysql.query(`UPDATE ${cmysql.dbName} SET checkbal = '${ear + cb}' WHERE id = '${author.id}'`)
                await cmysql.query(`UPDATE ${cmysql.dbName} SET earnings = '0' WHERE id = '${author.id}'`)

                if (embeds) {
                    bot.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: {
                                embeds: [
                                    {
                                        title: `**$${ear}** put in an Online Check!`,
                                        description: `**$${ear}** has been put into an online check. Deposit it in an ATM to add it to your balance.`
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
                                content: `**$${ear}** has been put into an online check. Deposit it in an ATM to add it to your balance.`,
                                flags: 1 << 6
                            }
                        }
                    })
                }

                logs.send({
                    embed: {
                        title: `${author.tag} used **/collect**`,
                        description: `**$${ear}** has been put into an online check.`,
                        thumbnail: {
                            url: `${author.avatarURL()}?size=1024`
                        },
                        timestamp: new Date(),
                        footer: {
                            text: `Alias: ${channel.guild.members.cache.get(author.id).nickname || "None"}`
                        }
                    }
                })
              });
          })
    }
}