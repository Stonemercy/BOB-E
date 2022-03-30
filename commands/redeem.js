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
		const { Users, CurrencyShop, UserItems } = require ('../dbObjects.js');
		const { Op } = require('sequelize');
		const staffID = '922309683883180093';
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
		const userItem = await UserItems.findOne({
			where: { user_id: interaction.user.id, item_id: item.id },
		});

		if (!item) return interaction.reply('That item doesn\'t exist.');
		if (userItem.amount < 1) return interaction.reply({ content: 'You don\'t have that item', ephemeral: true });

		const user = await Users.findOne({ where: { user_id: interaction.user.id } });
		await user.removeItem(item);

		return interaction.reply(`<@${staffID}>\n<@${interaction.user.id}> has redeemed: ${item.name}.`);
	},
};