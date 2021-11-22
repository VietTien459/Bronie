/** @format */

const Command = require("../Structures/Command.js");

module.exports = new Command({
	name: "help",
	description: "Shows all commands",
	async run(message, args, client) {
		message.reply(`;gacha \n ;ping`);
	}
});