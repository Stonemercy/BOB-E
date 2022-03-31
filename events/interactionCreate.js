module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const { currency } = require('../index.js');
		const userCheck = currency.get(interaction.user.id);

		if (!userCheck) {
			const newUser = await Users.create({ user_id: interaction.user.id });
			currency.set(interaction.user.id, newUser);
		}

		try {
			await command.execute(interaction);
			console.log(`${interaction.user.tag} just used the "${interaction.commandName}" command`);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};