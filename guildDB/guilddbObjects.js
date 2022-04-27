const Sequelize = require('sequelize');

const sequelize = new Sequelize('guildsdb', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './guildDB/guildsdb.sqlite',
});

const Guilds = require('./guildsModel/guilds.js')(sequelize, Sequelize.DataTypes);

module.exports = { Guilds };