const Sequelize = require('sequelize');

const sequelize = new Sequelize('guildsdb', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './guildDB/guildsdb.sqlite',
});

const Guilds = require('./guildsModel/guilds.js')(sequelize, Sequelize.DataTypes);

Reflect.defineProperty(Guilds.prototype, 'addGuild', {
	value: async function addGuild(guild) {
		const guildEntry = await Guilds.findOne({
			where: { guild_id: this.guild_id },
		});

		if (guildEntry) {
			return console.log(`${guild.name} tried to add their guild to the DB again.`);
		}

		return Guilds.create({ guild_id: this.guild_id });
	},
});

Reflect.defineProperty(Guilds.prototype, 'removeGuild', {
	value: async function removeGuild(guild) {
		const guildEntry = await Guilds.findOne({
			where: { user_id: this.guild_id },
		});

		if (guild.guild_id) {
			console.log(`${guild.name} has been removed from the DB.`);
			return guildEntry.destroy();
		}
	},
});

Reflect.defineProperty(Guilds.prototype, 'getStaffRole', {
	value: function getStaffRole() {
		return Guilds.findAll({
			where: { guild_id: this.guild_id },
			include: ['staff_role_id'],
		});
	},
});

Reflect.defineProperty(Guilds.prototype, 'getShopChannel', {
	value: function getShopChannel() {
		return Guilds.findAll({
			where: { guild_id: this.guild_id },
			include: ['shop_channel_id'],
		});
	},
});

module.exports = { Guilds };