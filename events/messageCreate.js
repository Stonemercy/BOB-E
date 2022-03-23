module.exports = {
	name: 'messageCreate',
	execute(message) {
		const { Users } = require('../dbobjects.js');
		const { currency } = require('../index.js');

		Reflect.defineProperty(currency, 'add', {
			value: async (id, amount) => {
				const user = currency.get(id);
				console.log(`User just posted a message and earned 1 currency:\n${message.author.tag}\n${id}`);

				if (user) {
					user.balance += Number(amount);
					console.log(`User balance: ${user.balance}`);
					return user.save();
				}

				const newUser = await Users.create({ user_id: id, balance: amount });
				currency.set(id, newUser);

				return newUser;
			},
		});

		if (message.author.bot) return;
		currency.add(message.author.id, 1);

	},
};
