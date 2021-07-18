module.exports = {
    name: `test`,

    execute(message, args, config, cmysql, client) {
        cmysql.add(message.author.id, 1)
        message.react('👍')
    }
}
