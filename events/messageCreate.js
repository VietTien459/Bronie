const fs = require('fs');

const { Users } = require('../dbObjects.js');

const Event = require("../Structures/Event.js");

const { Collection } = require('discord.js');

const currency = new Collection();

Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = currency.get(id);

		if (user) {
			user.balance += Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);

		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

module.exports = new Event("messageCreate", async (client, message) => {
	if (message.author.bot) return;

	const storedBalances = await Users.findAll();

	storedBalances.forEach(b => currency.set(b.user_id, b));

	currency.add(message.author.id, 280);

	if (!message.content.startsWith(client.prefix)) return;
		
	const args = message.content.substring(client.prefix.length).split(/ +/);

	const command = client.commands.find(cmd => cmd.name == args[0]);

	if (!command) return message.reply(`${args[0]} is not a valid command!`);

	command.run(message , args, client);
});
