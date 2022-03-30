const Sequelize = require('sequelize');

const sequelize = new Sequelize('currencyShop', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './currencyShopDB/currencyShop.sqlite',
});

const Users = require('./CSmodels/Users.js')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./CSmodels/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./CSmodels/UserItems.js')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Reflect.defineProperty(Users.prototype, 'addItem', {
	value: async function addItem(item) {
		const userItem = await UserItems.findOne({
			where: { user_id: this.user_id, item_id: item.id },
		});

		if (userItem) {
			userItem.amount += 1;
			return userItem.save();
		}

		return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
	},
});

Reflect.defineProperty(Users.prototype, 'removeItem', {
	value: async function removeItem(item) {
		const userItem = await UserItems.findOne({
			where: { user_id: this.user_id, item_id: item.id },
		});

		if (userItem.amount > 0) {
			userItem.amount -= 1;
			return userItem.save();
		}
	},
});

Reflect.defineProperty(Users.prototype, 'getItems', {
	value: function getItems() {
		return UserItems.findAll({
			where: { user_id: this.user_id },
			include: ['item'],
		});
	},
});

module.exports = { Users, CurrencyShop, UserItems };