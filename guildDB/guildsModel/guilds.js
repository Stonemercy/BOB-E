module.exports = (sequelize, DataTypes) => {
	return sequelize.define('guild', {
		guild_id: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		webhook_id: {
			type: DataTypes.STRING,
			unique: true,
		},
		webhook_channel_id: {
			type: DataTypes.STRING,
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
		shop_currency: {
			type: DataTypes.STRING,
			defaultValue: '💰',
		},
	});
};