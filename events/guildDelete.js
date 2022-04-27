module.exports = {
	name: 'guildDelete',
	async execute(guild) {
		const { Guilds } = require('../guildDB/guilddbObjects.js');
		const guildID = await Guilds.findOne({ where: { guild_id: guild.id } });

		if (guildID && guildID.guild_id === guild.id) {
			await Guilds.destroy({ where: { guild_id: guild.id } });
			return console.log(`Server "${guild.name}" has removed the bot.`);
		}
		else {
			return console.log(`Server "${guild.name}" removed the bot but they weren't found in the DB.`);
		}
	},
};
