// Require the necessary discord.js classes
const { token } = require('./config.json');

const { Op } = require('sequelize');

const { Collection, Formatters, Intents } = require('discord.js');

const { Users, CurrencyShop } = require('./dbObjects.js');

const Client = require("./Structures/Client.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILDS, 'GUILD_MESSAGES'] });

client.start(token);

