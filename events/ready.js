const Event = require("../Structures/Event.js");

module.exports = new Event("ready", async (client) => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
	client.user.setActivity(';gacha ;ping', { type: 'STREAMING' });
});