module.exports = {
    name: `pay`,

    execute(interaction, author, embeds, channel, logs, config, cmysql, bot) {
        var user = bot.users.cache.get(Object.values(interaction.data.options[0])[0])
        var amount = interaction.data.options.find(arg => arg.name.toLocaleLowerCase() == "amount").value
        var bal;
        var ubal;

        cmysql.con.query(`SELECT balance FROM ${cmysql.dbName} WHERE id = '${author.id}'`, async function (err, result, fields) {
            Object.keys(result).forEach(async function(key) {
                bal = Number(JSON.parse(JSON.stringify(result[key])).balance)
                if (amount > bal) {
                    if (embeds) {
                        bot.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    embeds: [
                                        {
                                            title: `Cannot Afford $${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                                            description: `You only have $${bal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}!`
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
                                    content: `You cannot afford to give that much! You only have $${bal}!`,
                                    flags: 1 << 6
                                }
                            }
                        })
                    }
                }
                cmysql.con.query(`SELECT balance FROM ${cmysql.dbName} WHERE id = '${author.id}'`, async function (err, result, fields) {
                    Object.keys(result).forEach(async function(key) {
                        ubal = Number(JSON.parse(JSON.stringify(result[key])).balance)
                        await cmysql.query(`UPDATE ${cmysql.dbName} SET balance = '${(Number(amount + ubal))}' WHERE id = '${user.id}'`)
                        await cmysql.query(`UPDATE ${cmysql.dbName} SET balance = '${(Number(bal - amount))}' WHERE id = '${author.id}'`)

                        bot.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: `<@${user.id}> has been given **$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** by **${author.username}**!`,
                                }
                            }
                        })

                        logs.send({
                            embed: {
                                title: `${author.tag} used **/pay**`,
                                description: `${author.username} paid ${user.tag} **$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**.`,
                                thumbnail: {
                                    url: `${author.avatarURL()}?size=1024`
                                },
                                timestamp: new Date(),
                                footer: {
                                    text: `Alias: ${channel.guild.members.cache.get(author.id).nickname || "None"}`
                                }
                            }
                        })
                    })
                })
            })
        })
    }
}