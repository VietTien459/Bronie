/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-inline-comments */
const Command = require("../Structures/Command.js");

const fs = require('fs');
// const { resourceLimits } = require('worker_threads');

const { MessageAttachment, MessageEmbed } = require('discord.js');

const { joinImages } = require('join-images');

const droplist_file = fs.readFileSync('./drop-list/expansion-supply.json');

const droplist = JSON.parse(droplist_file);

// image assets
const supply_card_img = 'https://static.wikia.nocookie.net/honkaiimpact3_gamepedia_en/images/b/b7/Expansion_Supply_Card.png/revision/latest/scale-to-width-down/256?cb=20180610095310';
const haxxor_bunny_img = 'https://cdnb.artstation.com/p/assets/covers/images/039/656/365/large/jung-a-yang-jung-a-yang-17.jpg?1626540911';

function gen_drop_image(img_list) {
	joinImages([img_list[0], img_list[1], img_list[2], img_list[3], img_list[4]], { direction: 'horizontal' }).then((img) => {
		img.toFile('./top.png');
	});
	joinImages([img_list[5], img_list[6], img_list[7], img_list[8], img_list[9]], { direction: 'horizontal' }).then((img) => {
		img.toFile('./bot.png');
	});
	setTimeout(function() {
		joinImages(['./top.png', './bot.png'], { direction: 'vertical' }).then((img) => {
			img.toFile('./full.png');
		});
	}, 1000);
}

function weighted_random(items, weights) {
	let i;

	for (i = 0; i < weights.length; i++) {weights[i] += weights[i - 1] || 0;}

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
	description: "Gacha Expansion Supply 10 rolls ",
	async run(message, args, client) {
		const items_list = [];
		const items_rate = [];
		const items_drop = [];
		const imagelist = [];
		const num_pulls = 10;
		// Get droprates and items list from JSON
		for (key in droplist) {
			if (droplist.hasOwnProperty(key)) {
				items_list.push(key);
				items_rate.push(droplist[key].droprate);
			}
		}
		for (let i = 0; i < num_pulls; i++) {
			items_drop.push(droplist[weighted_random(items_list, items_rate)]);
		}

		items_drop.sort(function(a, b) {
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

		for (let index = 0; index < items_drop.length; index++) {
			imagelist.push('img/' + items_drop[index].name + '.png');
			PullRes.addFields(
				{ name: items_drop[index].type, value : items_drop[index].display_text, inline : true },
			);

		}
		// PullRes.addFields({ name: '\u200B', value : '\u200B' });
		gen_drop_image(imagelist);

		setTimeout(function() {
			const file = new MessageAttachment('../Bronie/full.png');
			PullRes.setImage('attachment://full.png');
			message.reply({ embeds: [PullRes], files: [file] });
		}, 1500);

	},
});