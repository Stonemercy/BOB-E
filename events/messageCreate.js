module.exports = {
	name: 'messageCreate',
	async execute(message) {
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const { userCurrency } = require('../index.js');

		if (message.author.id === '937511867138580510' && message.channel.id === '937511250961768470') {
			const steamIDCheck = /\d{17}/g;
			const timeCheck = /\d{1,2}:\d{1,2}/g;
			const steamID = message.content.match(steamIDCheck);
			const time = message.content.match(timeCheck);
			const userSteamDBCheck = await Users.findOne({ where: { steam_id: steamID } });
			console.log(message.content);

			if (steamID && time && userSteamDBCheck) {
				const [ timeHours, timeMins ] = time.toString().split(':');
				const totalMins = (+timeMins) + (+timeHours) * 60;
				const userC = userCurrency.get(userSteamDBCheck.user_id);
				userC.balance += Number(totalMins);
				console.log(`User ${steamID} played for ${totalMins} mins`);
				userC.save();
				return;
			}
			else if (message.content.match(/(left server)/g)) {
				return console.log(`User ${steamID} has left the server but hasn't registered their Discord account`);
			} return;

		}
		else if (!message.author.bot) {
			const user = userCurrency.get(message.author.id);

			if (user) {
				/* const NinetyNinePercent = Math.floor(Math.random() * 101);
				console.log(NinetyNinePercent);
				if (NinetyNinePercent >= 99) { */
				// user.balance += Number(1);
				// message.channel.send(`${message.author.username} just got the random 1% bonus of 1000💰`);
				// }
				return user.save();
			}
			else {
				const newUser = await Users.create({ user_id: message.author.id });
				userCurrency.set(message.author.id, newUser);
				return newUser;
			}
		}
	},
};
