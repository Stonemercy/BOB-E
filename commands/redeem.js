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
		const { CurrencyShop, UserItems } = require ('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const { Op } = require('sequelize');
		const item = interaction.options.getString('item');
		const guildItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: item }, guild_id: interaction.guildId } });
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const currentUserItem = await UserItems.findOne({ where:{ user_id:interaction.user.id, guild_id:interaction.guildId, item_name: { [Op.like]: item } } });

		if (!currentGuild.shop_channel_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else if (!guildItem) {
			return interaction.reply({ content: 'That item doesn\'t exist, did you spell it correctly?', ephemeral: true });
		}
		else if (!currentUserItem) {
			return interaction.reply({ content: 'You don\'t have that item', ephemeral: true });
		}
		else {
			await currentUserItem.update({ amount: currentUserItem.amount -= Number(1) });
			if (currentUserItem.amount === 0) {
				await currentUserItem.destroy();
			}
			return interaction.reply(`<@&${currentGuild.staff_role_id}>\n<@${interaction.user.id}> has redeemed: **${currentUserItem.item_name}**`);
		}


	},
};