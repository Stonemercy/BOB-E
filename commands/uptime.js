const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Responds with the bot\'s uptime'),
	async execute(interaction) {
		const uptimeMs = interaction.client.uptime;
		function padTo2Digits(num) {
			return num.toString().padStart(2, '0');
		}
		function converMsToHM(ms) {
			let seconds = Math.floor(ms / 1000);
			let minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			seconds = seconds % 60;
			minutes = seconds >= 30 ? minutes + 1 : minutes;
			minutes = minutes % 60;
			return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
		}
		return interaction.reply(`Current session uptime (hours:minutes): ${converMsToHM(uptimeMs)}`);
	},
};