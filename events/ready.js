module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const { currency } = require('../index.js');
		const Sequelize = require('sequelize');
		const sequelize = new Sequelize('currencyShop', 'username', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			logging: false,
			storage: './currencyShopDB/currencyShop.sqlite',
		});
		const Users = require('../currencyShopDB/csModels/Users.js')(sequelize, Sequelize.DataTypes);
		const storedBalances = await Users.findAll();
		storedBalances.forEach(b => currency.set(b.user_id, b));
		console.log(`Users in collection: ${currency.size}`);

		client.user.setActivity('for errors in my code', { type: 'WATCHING' });
		console.log(`Ready! Logged in as "${client.user.tag}"`);
	},
};