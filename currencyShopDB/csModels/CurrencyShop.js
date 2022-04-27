module.exports = (sequelize, DataTypes) => {
	return sequelize.define('currency_shops', {
		guild_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			defaultValue: 'Item',
		},
		cost: {
			type: DataTypes.INTEGER,
			dafaultValue: 0,
		},
	}, {
		timestamps: false,
	});
};