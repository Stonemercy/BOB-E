const Sequelize = require('sequelize');

const sequelize = new Sequelize('currencyShop', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './currencyShopDB/currencyShop.sqlite',
});

const Users = require('./csModels/Users.js')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./csModels/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./csModels/UserItems.js')(sequelize, Sequelize.DataTypes);

module.exports = { Users, CurrencyShop, UserItems };