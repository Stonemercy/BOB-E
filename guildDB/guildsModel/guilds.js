module.exports = (sequelize, DataTypes) => {
	return sequelize.define('guilds', {
		guild_id: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		staff_role_id: {
			type: DataTypes.STRING,
			unique: true,
		},
		shop_channel_id: {
			type: DataTypes.STRING,
			unique: true,
		},
	});
};