let mysql = require('mysql');
const util = require('util');
let con = mysql.createConnection({
    host: 'panel.bitsec.dev',
    user: 'u318_3GXpXODhvF',
    password: 'g9t3NvB.6o4wOk7Lx!u8HhCp',
    database: 's318_TCPhone'
});

con.connect();
var dbName = 'users'
const query = util.promisify(con.query).bind(con);
module.exports = {con, query, dbName}

/*
async function balance(id) {
    cmysql.con.query(`SELECT balance FROM ${cmysql.dbName} WHERE id = '${author.id}'`, async function (err, result, fields) {
      Object.keys(result).forEach(async function(key) {
          var bal = JSON.parse(JSON.stringify(result[key])).balance
        });
    })
}

async function get(id, column = null) {
    cmysql.con.query(`SELECT ${column} FROM ${cmysql.dbName} WHERE id = '${author.id}'`, async function (err, result, fields) {
        Object.keys(result).forEach(function(key) {
            switch (column) {
                case 'team': {
                    return JSON.parse(JSON.stringify(result[key])).team
                }
                case 'balance': {
                    return JSON.parse(JSON.stringify(result[key])).balance
                }
                case 'currency': {
                    return JSON.parse(JSON.stringify(result[key])).currency
                }
                case 'income': {
                    return JSON.parse(JSON.stringify(result[key])).income
                }
                case 'job': {
                    return JSON.parse(JSON.stringify(result[key])).job
                }
                case 'earnings': {
                    return JSON.parse(JSON.stringify(result[key])).earnings
                }
                case 'transport': {
                    return JSON.parse(JSON.stringify(result[key])).transport
                }
                default: {
                    return JSON.parse(JSON.stringify(result[key]))
                }
            }
        });
    })
}

async function addUsers(guild) {
    guild.members.cache.forEach(async (member) => {
        if (!member.user.bot && !get(member.user.id)) {
            await cmysql.query(`INSERT INTO ${cmysql.dbName} (id, team, balance, currency, income, job, earnings, transport, name) VALUES ('${member.user.id}', 'none', '0', '$', 5, 'default', '0', 'none', '${member.user.tag}')`).catch(() => {return})
        }
    })
}

async function removeUser(id) {
    let team = get(id, 'team')
    let balance = get(id, 'balance')
    let currency = get(id, 'currency')
    let income = get(id, 'income')
    let job = get(id, 'job')
    let earnings = get(id, 'earnings')
    let transport = get(id, 'transport')
    await cmysql.query(`INSERT INTO backups (id, team, balance, currency, income, job, earnings, transport) VALUES ('${author.id}', '${team}', '${balance}', '${currency}', '${income}', '${job}', '${earnings}', '${transport}')`).catch(() => {return})
	await cmysql.query(`DELETE FROM ${cmysql.dbName} WHERE id = ${author.id}`).catch(() => {return})
}

async function set(id, column, content) {
    await cmysql.query(`UPDATE ${cmysql.dbName} SET ${column} = '${content}' WHERE id = '${author.id}'`, async function (err) {
        if (err) throw err;
    })
}

async function add(id, amount) {
    cmysql.con.query(`SELECT balance FROM ${cmysql.dbName} WHERE id = '${author.id}'`, async function (err, result, fields) {
      Object.keys(result).forEach(async function(key) {
          var bal = JSON.parse(JSON.stringify(result[key])).balance
          await cmysql.query(`UPDATE ${cmysql.dbName} SET balance = '${bal + <amount>}' WHERE id = '${author.id}'`, async function (err) {
            if (err) throw err;
          })
        });
    })

}

async function remove(id, amount) {
    cmysql.con.query(`SELECT balance FROM ${cmysql.dbName} WHERE id = '${author.id}'`, async function (err, result, fields) {
      Object.keys(result).forEach(async function(key) {
          var bal = JSON.parse(JSON.stringify(result[key])).balance
          await cmysql.query(`UPDATE ${cmysql.dbName} SET balance = '${bal - <amount>}' WHERE id = '${author.id}'`, async function (err) {
            if (err) throw err;
          })
        });
    })

}
*/