const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('redeem')
		.setDescription('Redeems a user\'s item')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('The item you wish to redeem')
				.setRequired(true)),
	async execute(interaction) {
		const { Users, CurrencyShop, UserItems } = require ('../currencyShopDB/csDBObjects.js');
		const { Op } = require('sequelize');
		const staffID = '922309683883180093';
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
		const userItem = await UserItems.findOne({
			where: { user_id: interaction.user.id, item_id: item.id },
		});
		const { Guilds } = require('../guildDB/guilddbObjects');
		const shopChannel = await Guilds.findOne({ where: { guild_id: interaction.guildId } });

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
			await user.removeItem(item);
			return interaction.reply(`<@${staffID}>\n<@${interaction.user.id}> has redeemed: ${item.name}.`);
		}


	},
};