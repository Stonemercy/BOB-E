const Sequelize = require('sequelize');

const sequelize = new Sequelize('currencyShop', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './currencyShopDB/currencyShop.sqlite',
});

const CurrencyShop = require('./csModels/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./csModels/Users.js')(sequelize, Sequelize.DataTypes);
require('./csModels/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'Reskin', cost: 5000 }),
		CurrencyShop.upsert({ name: 'Gender Swap', cost: 5000 }),
		CurrencyShop.upsert({ name: 'Talent Point Reset', cost: 10000 }),
		CurrencyShop.upsert({ name: 'Random Weather Roll', cost: 8000 }),
		CurrencyShop.upsert({ name: '15 min Growth Storm', cost: 8000 }),
	];

	await Promise.all(shop);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);