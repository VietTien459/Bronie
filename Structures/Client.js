/** @format */
const fs = require('fs');

const Discord = require("discord.js");

const Command = require("./Command.js");

const { prefix } = require('../config.json');

const Event = require("./Event.js");

const intents = new Discord.Intents(32767);

class Client extends Discord.Client {
	constructor() {
		super({ intents });
		/**
		 * @type {Discord.Collection<string, Command>}
		 */
		this.commands = new Discord.Collection();
		this.prefix = prefix ; 
	}

	start(token) {
		fs.readdirSync("./commands")
			.filter(file => file.endsWith(".js"))
			.forEach(file => {
				/**
				 * @type {Command}
				 */
				const command = require(`../commands/${file}`);
				console.log(`Command ${command.name} loaded`);
				this.commands.set(command.name, command);
			});
		fs.readdirSync("./events")
			.filter(file => file.endsWith(".js"))
			.forEach(file => {
				/**
				 * @type {Event}
				 */
				const event = require(`../events/${file}`);
				console.log(`Event ${event.event} loaded`);
				this.on(event.event, event.run.bind(null, this) )
			});
		this.login(token);
	}
}

module.exports = Client;