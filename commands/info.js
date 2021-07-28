const Discord = require('discord.js');

module.exports = {
    name: `info`,

    execute(interaction, author, embeds, channel, logs, config, cmysql, bot) {
        if (interaction.data.options) {
            var user = bot.users.cache.get(Object.values(interaction.data.options[0])[0])
        } else {
            var user = bot.users.cache.get(interaction.member.user.id)
        }
        if (embeds) var embed = new Discord.MessageEmbed()
        .setTitle(`${user.username}'s Info`)
        .setDescription('This is all of the information that is stored in the database.')
        .setTimestamp(new Date()); 
        else var embed = []
        
        cmysql.con.query(`SELECT * FROM ${cmysql.dbName} WHERE id = '${user.id}'`, async function (err, result, fields) {
            Object.keys(result).forEach(async function(key) {
                Object.entries(JSON.parse(JSON.stringify(result[key]))).forEach(entry => {
                    var [key, value] = entry;

                    if (embeds) {
                        switch(key) {
                            case 'name': {
                                embed.addField(`Username`, value, true)
                                break;
                            }
                            case 'id': {
                                embed.addField(`ID`, value, true)
                                break;
                            }
                            case 'team': {
                                embed.addField(`Team`, value, true)
                                break;
                            }
                            case 'balance': {
                                embed.addField(`Balance`, `$${value}`, true)
                                break;
                            }
                            case 'checkbal': {
                                embed.addField(`Check Balance`, `(uncashed balance)\n$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, true)
                                break;
                            }
                            case 'income': {
                                embed.addField(`Income`, `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} every 5 minutes`, true)
                                break;
                            }
                            case 'job': {
                                embed.addField(`Job`, value, true)
                                break;
                            }
                            case 'earnings': {
                                embed.addField(`Earnings`, `(uncollected balance)\n$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, true)
                                break;
                            }
                            case 'transport': {
                                embed.addField(`Transportation`, value.toLocaleUpperCase(), true)
                                break;
                            }
                            case 'embed': {
                                embed.addField(`Embeds`, `ON`, true)
                                break;
                            }
                            default: {
                                embed.addField(key.toLocaleUpperCase(), value.toLocaleUpperCase(), true)
                            }
                        }
                    } else {
                        switch(key) {
                            case 'name': {
                                embed.push(`**Username:** ${value}`)
                                break;
                            }
                            case 'id': {
                                embed.push(`**ID:** ${value}`)
                                break;
                            }
                            case 'team': {
                                embed.push(`**Team:** ${value}`)
                                break;
                            }
                            case 'balance': {
                                embed.push(`**Balance:** $${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
                                break;
                            }
                            case 'checkbal': {
                                embed.push(`**Check Balance (uncashed balance):** $${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
                                break;
                            }
                            case 'income': {
                                embed.push(`**Income:** $${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} every 5 minutes`)
                                break;
                            }
                            case 'job': {
                                embed.push(`**Job:** ${value}`)
                                break;
                            }
                            case 'earnings': {
                                embed.push(`**Earnings (uncollected balance):** $${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
                                break;
                            }
                            case 'transport': {
                                embed.push(`**Transportation:** ${value}`)
                                break;
                            }
                            case 'embed': {
                                embed.push(`**Embeds:** OFF`)
                                break;
                            }
                            default: {
                                embed.push(`**${key.toLocaleUpperCase()}:** ${value}`)
                            }
                        }
                    }
                  });
              });

              if (embeds) {
                bot.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                      type: 4,
                      data: {
                          flags: 1 << 6,
                          embeds: [embed]
                      }
                    }
                  })
              } else {
                bot.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                      type: 4,
                      data: {
                          flags: 1 << 6,
                          content: embed.join('\n\n')
                      }
                    }
                  })
              }

            logs.send({
                embed: {
                    title: `${author.tag} used **/info**`,
                    description: `Looked at the information for ${user.tag}.`,
                    thumbnail: {
                        url: `${author.avatarURL()}?size=1024`
                    },
                    footer: {
                        text: `Alias: ${channel.guild.members.cache.get(author.id).nickname || "(none)"}`
                    }
                }
            })
          })
    }
}