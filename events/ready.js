module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const { userCurrency } = require('../index.js');
		const Sequelize = require('sequelize');
		const sequelize = new Sequelize('currencyShop', 'username', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			logging: false,
			storage: './currencyShopDB/currencyShop.sqlite',
		});
		const Users = require('../currencyShopDB/csModels/Users.js')(sequelize, Sequelize.DataTypes);
		const storedBalances = await Users.findAll();
		storedBalances.forEach(b => userCurrency.set(b.user_id, b));
		const missingSteam = await Users.count({ where: { steam_id: '0' } });
		console.log(`Discord users in collection: ${userCurrency.size}`);
		console.log(`Users without steam ID's registered: ${missingSteam}`);
		console.log(`Latest user: ${userCurrency.lastKey()}, balance: ${userCurrency.last().balance}, steam ID: ${userCurrency.last().steam_id}`);

		client.user.setActivity('for errors in my code', { type: 'WATCHING' });
		console.log(`Ready! Logged in as "${client.user.tag}"`);
	},
};