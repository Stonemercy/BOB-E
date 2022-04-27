module.exports = {
	name: 'messageCreate',
	async execute(message) {
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects.js');
		const currentGuild = await Guilds.findOne({ where: { guild_id: message.guild.id } });
		const currentGuildUser = await Users.findOne({ where: { user_id: message.author.id, guild_id: message.guildId } });

		if (currentGuild !== null && message.author.id === currentGuild.webhook_id && message.channel.id === currentGuild.webhook_channel_id) {
			const steamIDCheck = /\d{17}/g;
			const timeCheck = /\d{1,2}:\d{1,2}/g;
			const steamID = message.content.match(steamIDCheck);
			const time = message.content.match(timeCheck);
			const userSteamDBCheck = await Users.findOne({ where: { steam_id: steamID, guild_id: message.guildId } });

			if (steamID && time && userSteamDBCheck) {
				const [ timeHours, timeMins ] = time.toString().split(':');
				const totalMins = (+timeMins) + (+timeHours) * 60;
				await currentGuildUser.update({ balance: currentGuildUser.balance += totalMins });
				console.log(`User ${steamID} played for ${totalMins} mins`);
				return;
			}
			else if (message.content.match(/(left server)/g)) {
				return console.log(`User ${steamID} has left their server but hasn't registered their Discord account`);
			}

		}
		else if (!message.author.bot) {
			if (currentGuildUser) {
				/* const NinetyNinePercent = Math.floor(Math.random() * 101);
				console.log(NinetyNinePercent);
				if (NinetyNinePercent >= 99) { */
				await currentGuildUser.update({ balance: currentGuildUser.balance += Number(1) });
				// message.channel.send(`${message.author.username} just got the random 1% bonus of 1000💰`);
				// }
				return;
			}
			else {
				await Users.create({ user_id: message.author.id, username: message.author.tag, guild_id: message.guildId });
				return;
			}
		}
	},
};
