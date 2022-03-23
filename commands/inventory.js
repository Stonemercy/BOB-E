const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Check your inventory, or someone else\'s')
		.addUserOption(option =>
			option
				.setName('name')
				.setDescription('The name of the person who\'s inventory you want to check')
				.setRequired(false)),
	async execute(interaction) {
		const { Users } = require('../dbObjects.js');
		const target = interaction.options.getUser('user') ?? interaction.user;
		console.log(`Target ID: ${target.id}`);
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();

		if (!items.length) return interaction.reply(`${target.tag} has nothing!`);

		return interaction.reply(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);

	},
};