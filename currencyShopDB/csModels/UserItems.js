module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_item', {
		user_id: DataTypes.STRING,
		guild_id: DataTypes.INTEGER,
		item_name: DataTypes.STRING,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			min: 0,
			defaultValue: 0,
		},
	}, {
		timestamps: false,
	});
};