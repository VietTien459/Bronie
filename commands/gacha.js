/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-inline-comments */
const Command = require("../Structures/Command.js");

const Canvas = require('canvas');

const fs = require('fs');

// const { resourceLimits } = require('worker_threads');

const { MessageAttachment, MessageEmbed } = require('discord.js');

// const droplist_file = fs.readFileSync('./data/drop-list/expansion-supply.json');

// const droplist = JSON.parse(droplist_file);
const droplist = require('../data/drop-list/expansion-supply.json');

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

Reflect.defineProperty(currency, 'reduceCounterSoft', {
	/* eslint-disable-next-line func-name-matching */
	value: async function reduceCounterSoft(id, amount) {
		const user = currency.get(id);

		if (user) {
			user.countersoft -= Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, countersoft: amount });
		currency.set(id, newUser);

		return newUser;
	},
});

Reflect.defineProperty(currency, 'getCounterSoft', {
	/* eslint-disable-next-line func-name-matching */
	value: function getCounterSoft(id) {
		const user = currency.get(id);
		return user ? user.countersoft : 0;
	},
});

Reflect.defineProperty(currency, 'resetCounterSoft', {
	/* eslint-disable-next-line func-name-matching */
	value: async function resetCounterSoft(id) {
		const user = currency.get(id);

		if (user) {
			user.countersoft = 9;
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, countersoft: amount });
		currency.set(id, newUser);

		return newUser;
	},
});

Reflect.defineProperty(currency, 'reduceCounterHard', {
	/* eslint-disable-next-line func-name-matching */
	value: async function reduceCounterHard(id, amount) {
		const user = currency.get(id);

		if (user) {
			user.counterhard -= Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, counterhard: amount });
		currency.set(id, newUser);

		return newUser;
	},
});

Reflect.defineProperty(currency, 'getCounterHard', {
	/* eslint-disable-next-line func-name-matching */
	value: function getCounterHard(id) {
		const user = currency.get(id);
		return user ? user.counterhard : 0;
	},
});

Reflect.defineProperty(currency, 'resetCounterHard', {
	/* eslint-disable-next-line func-name-matching */
	value: async function resetCounterHard(id) {
		const user = currency.get(id);

		if (user) {
			user.counterhard = 99;
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, counterhard: amount });
		currency.set(id, newUser);

		return newUser;
	},
});
// image assets
const supply_card_img = 'https://static.wikia.nocookie.net/honkaiimpact3_gamepedia_en/images/b/b7/Expansion_Supply_Card.png/revision/latest/scale-to-width-down/256?cb=20180610095310';
const haxxor_bunny_img = 'https://cdnb.artstation.com/p/assets/covers/images/039/656/365/large/jung-a-yang-jung-a-yang-17.jpg?1626540911';


function weighted_random(items, weights) {
	if (items.length !== weights.length) {
		throw new Error('Items and weights must be of the same size');
	}

	if (!items.length) {
		throw new Error('Items must not be empty');
	}

	let weights_copy = [];

	for (let index = 0; index < weights.length; index++) {
		weights_copy[index] = weights[index];
	}

	const cumulativeWeights = [];
	for (let i = 0; i < weights.length; i += 1) {
		cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
	}

	const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
	const randomNumber = maxCumulativeWeight * Math.random();

	for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
		if (cumulativeWeights[itemIndex] >= randomNumber) {
			return items[itemIndex]
		}
	}
}


module.exports = new Command({
	name: "gacha",
	description: "Gacha Expansion Supply 10 rolls",
	async run(message, args, client) {
		const storedBalances = await Users.findAll();
		storedBalances.forEach(b => currency.set(b.user_id, b));

		if (currency.getBalance(message.author.id) < 2800) {
			message.reply('Not enough crystals :(');
			return;
		}

		currency.addBalance(message.author.id, -2800);

		let items_list = [];
		let items_rate = [];

		for (key in droplist) {
			if (droplist.hasOwnProperty(key)) {
				items_list.push(key);
				items_rate.push(droplist[key].droprate);
			}
		}

		const items_drop = [];
		const num_pulls = 10;

		for (let i = 0; i < num_pulls; i++) {
			let current_drop;
			if (currency.getCounterHard(message.author.id) == 0) {
				items_drop.push(droplist['s-rank-card']);
				current_drop = droplist['s-rank-card'];
				currency.resetCounterHard(message.author.id);
				currency.resetCounterSoft(message.author.id);
			} else if (currency.getCounterSoft(message.author.id) == 0) {
				current_drop = droplist[weighted_random(items_list, items_rate)];

				while ((current_drop.type != 'A Rank Character') && (current_drop.type != 'S Rank Character')) {
					current_drop = droplist[weighted_random(items_list, items_rate)];
					console.log('reroll -> ' + current_drop.name);
				}

				items_drop.push(current_drop);
				currency.resetCounterSoft(message.author.id);
			} else {
				currency.reduceCounterSoft(message.author.id, 1);
				currency.reduceCounterHard(message.author.id, 1);

				current_drop = droplist[weighted_random(items_list, items_rate)];
				items_drop.push(current_drop);

				if (current_drop.type == 'A Rank Character') {
					currency.resetCounterSoft(message.author.id);
				}
				else if (current_drop.type == 'S Rank Character') {
					currency.resetCounterSoft(message.author.id);
					currency.resetCounterHard(message.author.id);
				}
			}
			// console.log(current_drop.name + "\t" + currency.getCounterSoft(message.author.id) + "\t" + currency.getCounterHard(message.author.id));
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

		context.drawImage(img_output[0], 0, 25, 200, 200);
		context.drawImage(img_output[1], 200, 25, 200, 200);
		context.drawImage(img_output[2], 400, 25, 200, 200);
		context.drawImage(img_output[3], 600, 25, 200, 200);
		context.drawImage(img_output[4], 800, 25, 200, 200);

		context.drawImage(img_output[5], 0, 225, 200, 200);
		context.drawImage(img_output[6], 200, 225, 200, 200);
		context.drawImage(img_output[7], 400, 225, 200, 200);
		context.drawImage(img_output[8], 600, 225, 200, 200);
		context.drawImage(img_output[9], 800, 225, 200, 200);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'gacha.png');

		PullRes.setImage('attachment://gacha.png');
		message.reply({ embeds: [PullRes], files: [attachment] });
	},
});