const Sequelize = require('sequelize');

const sequelize = new Sequelize('guildsdb', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './guildDB/guildsdb.sqlite',
});

require('./guildsModel/guilds.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {

	console.log('Database synced');

	sequelize.close();
}).catch(console.error);