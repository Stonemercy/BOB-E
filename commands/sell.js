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
		const { Users, CurrencyShop, UserItems } = require ('../currencyShopDB/csDBObjects.js');
		const { Op } = require('sequelize');
		const item = interaction.options.getString('item');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const guildItem = await CurrencyShop.findOne({ where: { guild_id: interaction.guildId, name: { [Op.like]: item } } });
		const currentUserItem = await UserItems.findOne({ where: { user_id: interaction.user.id, guild_id: interaction.guildId, item_name: { [Op.like]: item } } });
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const currentUser = await Users.findOne({ where: { user_id: interaction.user.id, guild_id: interaction.guildId } });

		if (!currentGuild.shop_channel_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else if (!guildItem) {
			return interaction.reply('That item doesn\'t exist.');
		}
		else if (!currentUserItem) {
			return interaction.reply({ content: 'You don\'t have that item', ephemeral: true });
		}
		else if (currentUserItem.amount < 1) {
			return interaction.reply({ content: 'You don\'t have that item', ephemeral: true });
		}
		else {
			console.log(`Item name: ${guildItem.name}\nCost: ${guildItem.cost}`);
			await currentUser.update({ balance: currentUser.balance += Number(guildItem.cost * 0.75) });
			await currentUserItem.update({ amount: currentUserItem.amount -= Number(1) });
			if (currentUserItem.amount === 0) {
				await currentUserItem.destroy();
			}
			return interaction.reply(`You've sold: ${item} for ${guildItem.cost * 0.75}.\nCurrent balance: ${currentGuild.shop_currency} ${currentUser.balance}`);

		}

	},
};