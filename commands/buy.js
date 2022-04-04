const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('What you want to buy')
				.setRequired(true)),
	async execute(interaction) {
		const { userCurrency } = require ('../index.js');
		const { Users, CurrencyShop } = require ('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const { Op } = require('sequelize');
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
		const shopChannel = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		Reflect.defineProperty(userCurrency, 'getBalance', {
			value: id => {
				const user = userCurrency.get(id);
				return user ? user.balance : 0;
			},
		});
		Reflect.defineProperty(userCurrency, 'add', {
			value: async (id, amount) => {
				const user = userCurrency.get(id);

				if (user) {
					user.balance += Number(amount);
					return user.save();
				}

				const newUser = await Users.create({ user_id: id, balance: amount });
				userCurrency.set(id, newUser);

				return newUser;
			},
		});

		if (!shopChannel) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== shopChannel.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${shopChannel.shop_channel_id}>`, ephemeral: true });
		}
		else if (!item) {
			return interaction.reply('That item doesn\'t exist.');
		}
		else if (item.cost > userCurrency.getBalance(interaction.user.id)) {
			return interaction.reply(`You currently have ${userCurrency.getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
		}
		else {
			const user = await Users.findOne({ where: { user_id: interaction.user.id } });
			userCurrency.add(interaction.user.id, -item.cost);
			await user.addItem(item);

			return interaction.reply(`You've bought: ${item.name}.\nRemaining balance: ${userCurrency.getBalance(interaction.user.id)}`);
		}

	},
};