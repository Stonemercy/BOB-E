const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tp')
		.setDescription('See when your next talent point is')
		.addStringOption(option =>
			option
				.setName('growth')
				.setDescription('Your growth')
				.setRequired(true)),
	async execute(interaction) {
		const growthLevel = interaction.options.getString('growth');
		if (growthLevel.length > 5 || growthLevel.length <= 1) return interaction.reply({ content: `<@${interaction.user.id}>, please provide a growth level like this:\n1.555`, ephemeral: true });

		const talentPoints = [0.118, 0.184, 0.177, 0.206, 0.236, 0.285, 0.265, 0.295, 0.324, 0.353, 0.383, 0.412, 0.442, 0.471, 0.500,
			0.530, 0.559, 0.589, 0.618, 0.648, 0.677, 0.706, 0.706, 0.736, 0.765, 0.800, 0.824, 0.875, 0.938, 1.000,
			1.070, 1.130, 1.190, 1.250, 1.313, 1.375, 1.438, 1.500, 1.563, 1.625, 1.688, 1.750, 1.813, 1.875, 1.938,
			2.000, 2.070, 2.130, 2.190, 2.250, 2.313, 2.375, 2.438, 2.500, 2.563, 2.625, 2.688, 2.750, 2.813, 2.875,
			2.938, 3.000, 3.070, 3.130, 3.190, 3.250, 3.313, 3.375, 3.438, 3.500, 3.563, 3.625, 3.688, 3.750, 3.813,
			3.875, 3.938, 4.000, 4.070, 4.130, 4.190, 4.250, 4.313, 4.375, 4.438, 4.500, 4.563, 4.625, 4.688, 4.750,
			4.813, 4.875];

		function nextTP(value) {
			return value > growthLevel;
		}

		const nextNum = Math.min(...talentPoints.filter(nextTP));
		if (growthLevel >= 4.875) {
			return interaction.reply({ content: 'You have to more talent points to get!', ephemeral: true });
		}
		else {
			return interaction.reply({ content: `Your next talent point is at growth ${nextNum}`, ephemeral: true });
		}

	},
};