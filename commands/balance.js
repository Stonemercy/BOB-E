const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check your balance, or someone else\'s')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The person who\'s balance you want to check.')
				.setRequired(false)),
	async execute(interaction) {
		const { currency } = require('../index.js');
		const target = interaction.options.getUser('user') ?? interaction.user;
		Reflect.defineProperty(currency, 'getBalance', {
			value: id => {
				const user = currency.get(id);
				return user ? user.balance : 0;
			},
		});

		return interaction.reply(`<@${target.id}> has ${currency.getBalance(target.id)}💰`);
	},
};