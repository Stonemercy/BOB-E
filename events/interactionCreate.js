module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const userCheck = Users.findOne({ where: { user_id: interaction.user.id } });

		if (!userCheck) {
			await Users.create({ user_id: interaction.user.id, username: interaction.user.tag, guild_id: interaction.guildId });
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};