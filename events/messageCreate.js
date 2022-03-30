module.exports = {
	name: 'messageCreate',
	async execute(message) {
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const { currency } = require('../index.js');

		// 937512103701540874 is connection channel
		if (message.author.name === 'BoB Connection') {
			if (message.channel.id === '951542167959134240') {
				const steamIDCheck = /\d{17}/g;
				const timeCheck = /\d{1,2}:\d{2}/g;
				const steamID = message.content.match(steamIDCheck);
				const time = message.content.match(timeCheck);
				const [ timeHours, timeMins ] = time.toString().split(':');
				const totalMins = (+timeMins) + (+timeHours) * 60;
				const steamUser = currency.get(steamID);

				if (steamUser) {
					steamUser.balance += Number(totalMins);
					console.log(`User balance: ${steamUser.balance}`);
					return steamUser.save();
				}
				const newUser = await Users.create({ steam_id: steamID, balance: totalMins });
				currency.set(message.author.id, newUser);
				return newUser;
			}
		}
		else if (!message.author.bot) {
			const user = currency.get(message.author.id);

			if (user) {
				const NinetyNinePercent = Math.floor(Math.random() * 101);
				console.log(NinetyNinePercent);
				if (NinetyNinePercent >= 99) {
					user.balance += Number(1000);
					message.channel.send(`${message.author.username} just got the random 1% bonus of 1000💰`);
				}
				return user.save();
			}
			const newUser = await Users.create({ user_id: message.author.id });
			currency.set(message.author.id, newUser);
			return newUser;
		}
	},
};
