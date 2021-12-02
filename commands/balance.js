/** @format */

const Command = require("../Structures/Command.js");

const { Collection } = require('discord.js');

const currency = new Collection();

const { Users } = require('../dbObjects.js');

Reflect.defineProperty(currency, 'addBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: async function addBalance(id, amount) {
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

module.exports = new Command({
    name: "balance",
    description: "Shows balance",
    async run(message, args, client) {
        const storedBalances = await Users.findAll();
        storedBalances.forEach(b => currency.set(b.user_id, b));
        message.reply(message.author.tag + ' currently have ' + currency.getBalance(message.author.id) + ' crystals');
    }
});