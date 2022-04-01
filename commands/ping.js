const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responds with the bot\'s ping'),
	async execute(interaction) {
		return interaction.reply(`Pong! ||Responded in ${interaction.client.ws.ping}ms||`);
	},
};