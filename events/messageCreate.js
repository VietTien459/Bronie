const fs = require('fs');
const lines_file = fs.readFileSync('./voice-line/voice-lines.json');
const lines_json = JSON.parse(lines_file);
const lines = lines_json.bridge;


module.exports = {
	name: 'messageCreate',
	execute(msg) {
		// console.log('Bronie heard something');
		if ((msg.channel.name.includes('trò-chuyện-cùng-bronie') || msg.channel.name.includes('bronie-test')) && (msg.author.id != '899984590695968788')) {
			msg.reply(lines[Math.floor(Math.random() * lines.length)]);
		}
		if (msg.content == 'Bronie ơi') {
			msg.reply('Loz gì');
		}
		if (msg.author.id != '899984590695968788') {
			msg.react('😄');
		}
		if ((msg.channel.name.includes('phòng-ngủ-của-teriri')) && (msg.author.id != '899984590695968788')) {
			msg.reply('Cái gì hay thế cho Bronie xem với :o ');
		}
		if (msg.author.id == '434737143395516416') {
			msg.reply('dit em ai chan');
		}
	},
};