const Sequelize = require('sequelize');

const sequelize = new Sequelize('currencyShop', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './currencyShopDB/currencyShop.sqlite',
});

require('./csModels/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./csModels/Users.js')(sequelize, Sequelize.DataTypes);
require('./csModels/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {

	console.log('Database synced');

	sequelize.close();
}).catch(console.error);