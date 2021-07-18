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

async function balance(id) {
    con.query(`SELECT balance FROM ${dbName} WHERE id = '${id}'`, function (err, result, fields) {
      Object.keys(result).forEach(async function(key) {
          var row = result[key];
          var results = JSON.parse(JSON.stringify(row))
          return(results.balance)
        });
    })
}

async function get(id, column = null) {
    con.query(`SELECT ${column} FROM ${dbName} WHERE id = '${id}'`, function (err, result, fields) {
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            var results = JSON.parse(JSON.stringify(row))
            switch (column) {
                case 'team': {
                    return(results.team)
                }
                case 'balance': {
                    return(results.balance)
                }
                case 'currency': {
                    return(results.currency)
                }
                case 'income': {
                    return(results.income)
                }
                case 'job': {
                    return(results.job)
                }
                case 'earnings': {
                    return(results.earnings)
                }
                case 'transport': {
                    return(results.transport)
                }
                default: {
                    return(results)
                }
            }
        });
    })
}

async function addUsers(guild) {
    guild.members.cache.forEach(async (member) => {
        if (!member.user.bot && !get(member.user.id)) {
            await query(`INSERT INTO ${dbName} (id, team, balance, currency, income, job, earnings, transport, name) VALUES ('${member.user.id}', 'none', '0', '$', 5, 'default', '0', 'none', '${member.user.tag}')`).catch(() => {return})
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
    await query(`INSERT INTO backups (id, team, balance, currency, income, job, earnings, transport) VALUES ('${id}', '${team}', '${balance}', '${currency}', '${income}', '${job}', '${earnings}', '${transport}')`).catch(() => {return})
	await query(`DELETE FROM ${dbName} WHERE id = ${id}`).catch(() => {return})
}

async function set(id, column, content) {
    let sql = `UPDATE ${dbName} SET ${column} = '${content}' WHERE id = '${id}'`;
    await query(sql, function (err) {
        if (err) throw err;
    })
}

module.exports = {balance, addUsers, removeUser, set, get, balance};