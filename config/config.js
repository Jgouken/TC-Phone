const Discord = require('discord.js');
const bot = new Discord.Client();
const db = require("mongodb")
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});


module.exports = {
    Discord: Discord, 
    bot: bot,
    connection: connection,
    
    name: 'TC-Phone', // The name of your bot. Optional use.
    TOKEN: `ODYwMjU5OTgzMzgyNTQ0NDE1.YN4pig.qeOt54CIeyJB9HxQ3kBgKn2xKfc`, // Use an env if this is public. Do not share your bot's token
    prefix: `tc-`, // Ideal to use config.prefix to mention the prefix, just in case it changes.
}