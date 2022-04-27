module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		guild_id: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		steam_id: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};