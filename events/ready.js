module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const SteamAPI = require('steamapi');
		const { steamKey } = require('../config.json');
		const steam = new SteamAPI(steamKey);
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const totalUsers = await Users.count();
		const missingSteam = await Users.count({ where: { steam_id: '0' } });
		console.log(`Discord users in database: ${totalUsers}`);
		console.log(`Users without steam ID's registered: ${missingSteam}`);

		client.user.setActivity('for errors in my code', { type: 'WATCHING' });
		console.log(`Ready! Logged in as "${client.user.tag}"`);

		const steamPromise = await steam.getGamePlayers(719890);

		console.log(`Current users playing BoB: ${steamPromise}`);
	},
};