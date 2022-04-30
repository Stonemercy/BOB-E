module.exports = {
	name: 'messageCreate',
	async execute(message) {
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects.js');
		const currentGuild = await Guilds.findOne({ where: { guild_id: message.guild.id } });

		if (currentGuild !== null && message.author.id === currentGuild.webhook_id && message.channel.id === currentGuild.webhook_channel_id) {
			const steamIDCheck = /\d{17}/g;
			const timeCheck = /\d{1,2}:\d{1,2}/g;
			const steamID = message.content.match(steamIDCheck);
			const time = message.content.match(timeCheck);
			const userSteamDBCheck = await Users.findOne({ where: { steam_id: steamID, guild_id: message.guildId } });

			if (steamID && time && userSteamDBCheck) {
				const [ timeHours, timeMins ] = time.toString().split(':');
				const totalMins = (+timeMins) + (+timeHours) * 60;
				if (userSteamDBCheck) {
					await userSteamDBCheck.update({ balance: userSteamDBCheck.balance += totalMins });
				}
				else {
					return console.log(`User ${steamID} has left their server but hasn't registered their Discord account`);
				}
				return console.log(`User ${steamID} played for ${totalMins} mins`);

			}
			else if (message.content.match(/(left server)/g)) {
				return console.log(`User ${steamID} has left their server but hasn't registered their Discord account`);
			}

		}
		else if (!message.author.bot) {
			const currentGuildUser = await Users.findOne({ where: { user_id: message.author.id, guild_id: message.guild.id } });
			if (currentGuildUser) {
				return;
			}
			else {
				await Users.create({ user_id: message.author.id, username: message.author.tag, guild_id: message.guildId });
				return;
			}
		}
	},
};
