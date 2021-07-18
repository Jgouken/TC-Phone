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
      con.query(`SELECT * FROM ${dbName} WHERE id = '${id}'`, function (err, result, fields) {
        Object.keys(result, function(key) {
            var row = result[key];
            return(row.balance)
          });
      })
}

async function get(id, column = null) {
    con.query(`SELECT * FROM ${dbName} WHERE id = '${id}'`, function (err, result, fields) {
        Object.keys(result, function(key) {
            var row = result[key];
            switch (column) {
                case 'team': {
                    return(row.team)
                }
                case 'balance': {
                    return(row.balance)
                }
                case 'currency': {
                    return(row.currency)
                }
                case 'income': {
                    return(row.income)
                }
                case 'job': {
                    return(row.job)
                }
                case 'earnings': {
                    return(row.earnings)
                }
                case 'transport': {
                    return(row.transport)
                }
                default: {
                    return(row)
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
    await query(`INSERT INTO backups (id, team, balance, currency, income, job, earnings, transport) VALUES ('${id}', '${team}', '${balance}', '${currency}', ${income}, '${job}', '${earnings}', '${transport}')`).catch(() => {return})
	await query(`DELETE FROM ${dbName} WHERE id = ${id}`).catch(() => {return})
}

async function set(id, column, content) {
    let sql = `UPDATE ${dbName} SET ${column} = '${content}' WHERE id = '${id}'`;
    await query(sql, function (err) {
        if (err) throw err;
    })
}

async function add(id, currency) {
    let bal = await balance(id)
    await set(id, 'balance', bal += currency)
}

async function remove(id, currency) {
    let bal = balance(id)
    set(id, 'balance', bal -= currency)
}

async function balance(id) {
    return balance(id)
}

async function leaderboard() {
    await query(`SELECT * FROM ${dbName} ORDER BY balance LIMIT 10`, function (err, result) {
        Object.keys(result, function(key) {
            var row = result[key];
            return((`**${row.name}:** ${row.balance}\n`).trim())
          });
    })
}

module.exports = {balance, addUsers, removeUser, set, add, remove, get, balance, leaderboard};