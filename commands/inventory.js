const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Check your inventory, or someone else\'s')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The name of the person who\'s inventory you want to check')
				.setRequired(false)),
	async execute(interaction) {
		const { Users } = require('../dbObjects.js');
		const target = interaction.options.getUser('user') ?? interaction.user;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();

		if (!items.length) return interaction.reply(`<@${target.id}> has nothing!`);

		return interaction.reply(`<@${target.id}> currently has: \n${items.map(i => `${i.amount} ${i.item.name}`).join('\n')}`);

	},
};