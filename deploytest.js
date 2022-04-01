const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commandsTest = [];
const commandTestFiles = fs.readdirSync('./commandstest').filter(file => file.endsWith('.js'));

for (const file of commandTestFiles) {
	const commandTest = require(`./commandstest/${file}`);
	commandsTest.push(commandTest.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started reloading test slash commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commandsTest },
		);

		console.log('Successfully reloaded test slash commands.');
	}
	catch (error) {
		console.error(error);
	}
})();