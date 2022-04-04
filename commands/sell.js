const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Sell an item for 75% of the original price')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('What you want to sell')
				.setRequired(true)),
	async execute(interaction) {
		const { userCurrency } = require ('../index.js');
		const { Users, CurrencyShop, UserItems } = require ('../currencyShopDB/csDBObjects.js');
		const { Op } = require('sequelize');
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
		const userItem = await UserItems.findOne({ where: { user_id: interaction.user.id, item_id: item.id } });
		const { Guilds } = require('../guildDB/guilddbObjects');
		const shopChannel = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
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
		else if (userItem.amount < 1) {
			return interaction.reply({ content: 'You don\'t have that item', ephemeral: true });
		}
		else {
			const user = await Users.findOne({ where: { user_id: interaction.user.id } });
			userCurrency.add(interaction.user.id, item.cost * 0.75);
			await user.removeItem(item);
			return interaction.reply(`You've sold: ${item.name}.\nCurrent balance: <:vox_symbol:940510190443307009>${userCurrency.getBalance(interaction.user.id)}`);

		}

	},
};