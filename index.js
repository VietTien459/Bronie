// Require the necessary discord.js classes
const { Intents } = require('discord.js');

const { token } = require('./config.json');

const Client = require("./Structures/Client.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_MESSAGES'] });

client.start(token);