const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Tie your Steam ID to your Discord account')
		.addStringOption(option =>
			option
				.setName('steamid')
				.setDescription('Your Steam ID')
				.setRequired(true)),
	async execute(interaction) {
		const { Users } = require('../dbobjects.js');
		const userID = interaction.user.id;
		const steamIdToCheck = interaction.options.getString('steamid');
		const steamIDChecker = /\d{17}/g;
		const steamId = steamIdToCheck.match(steamIDChecker);

		if (!steamId) {
			return interaction.reply({ content: 'You did not supply a proper steam ID (17 digits)', ephemeral: true });
		}
		else if (steamId) {
			await Users.upsert({ user_id: userID, steam_id: steamId });
			return interaction.reply(`Successfully added ${steamId} as your steam id!`);
		}

	},
};