/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-inline-comments */
const Command = require("../Structures/Command.js");

const Canvas = require('canvas');

const fs = require('fs');

// const { resourceLimits } = require('worker_threads');

const { MessageAttachment, MessageEmbed } = require('discord.js');

const droplist_file = fs.readFileSync('./data/drop-list/expansion-supply.json');

// const droplist = JSON.parse(droplist_file);
const droplist = require('../data/drop-list/expansion-supply.json')

// image assets
const supply_card_img = 'https://static.wikia.nocookie.net/honkaiimpact3_gamepedia_en/images/b/b7/Expansion_Supply_Card.png/revision/latest/scale-to-width-down/256?cb=20180610095310';
const haxxor_bunny_img = 'https://cdnb.artstation.com/p/assets/covers/images/039/656/365/large/jung-a-yang-jung-a-yang-17.jpg?1626540911';


function weighted_random(items, weights) {
	let i;

	for (i = 0; i < weights.length; i++) { weights[i] += weights[i - 1] || 0; }

	const random = Math.random() * weights[weights.length - 1];

	for (i = 0; i < weights.length; i++) {
		if (weights[i] > random) {
			break;
		}
	}
	return items[i];
}

module.exports = new Command({
	name: "gacha",
	description: "Gacha Expansion Supply 10 rolls",
	async run(message, args, client) {
		const items_list = [];
		const items_rate = [];
		for (key in droplist) {
			if (droplist.hasOwnProperty(key)) {
				items_list.push(key);
				items_rate.push(droplist[key].droprate);
			}
		}

		const items_drop = [];
		const num_pulls = 10;

		for (let i = 0; i < num_pulls; i++) {
			items_drop.push(droplist[weighted_random(items_list, items_rate)]);
		}

		items_drop.sort(function (a, b) {
			return b.rarity - a.rarity;
		});

		const PullRes = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Expansion Supply')
			.setURL('https://www.youtube.com/watch?v=gYQYmikUtiM')
			.setAuthor('Haxxor Bunny', haxxor_bunny_img, 'https://github.com/VietTien459/Bronie')
			// .setDescription('')
			.setThumbnail(supply_card_img)
			.setTimestamp()
			.setFooter('Bye Bye', supply_card_img);
		
		const img_output = [];
		for (let index = 0; index < items_drop.length; index++) {
			img_output.push(await Canvas.loadImage('img/' + items_drop[index].name + '.png'));
			PullRes.addFields(
				{ name: items_drop[index].type, value: items_drop[index].display_text, inline: true },
			);
		}
		// PullRes.addFields({ name: '\u200B', value : '\u200B' });
		const canvas = Canvas.createCanvas(1000, 500);
		const context = canvas.getContext('2d');

		context.drawImage(img_output[0],0,25,200,200);
		context.drawImage(img_output[1],200,25,200,200);
		context.drawImage(img_output[2],400,25,200,200);
		context.drawImage(img_output[3],600,25,200,200);
		context.drawImage(img_output[4],800,25,200,200);

		context.drawImage(img_output[5],0,225,200,200);
		context.drawImage(img_output[6],200,225,200,200);
		context.drawImage(img_output[7],400,225,200,200);
		context.drawImage(img_output[8],600,225,200,200);
		context.drawImage(img_output[9],800,225,200,200);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'gacha.png');

		PullRes.setImage('attachment://gacha.png');
		message.reply({ embeds: [PullRes], files: [attachment] });
	},
});