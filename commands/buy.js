const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('What you want to buy')
				.setRequired(false)),
	async execute(interaction) {
		const { currency } = require ('../index.js');
		const { Users, CurrencyShop } = require ('../dbObjects.js');
		const { Op } = require('sequelize');
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
		Reflect.defineProperty(currency, 'getBalance', {
			value: id => {
				const user = currency.get(id);
				return user ? user.balance : 0;
			},
		});
		Reflect.defineProperty(currency, 'add', {
			value: async (id, amount) => {
				const user = currency.get(id);

				if (user) {
					user.balance += Number(amount);
					return user.save();
				}

				const newUser = await Users.create({ user_id: id, balance: amount });
				currency.set(id, newUser);

				return newUser;
			},
		});
		console.log(`User ${interaction.user.tag} tried to buy ${item}`);

		if (!item) return interaction.reply('That item doesn\'t exist.');
		if (item.cost > currency.getBalance(interaction.user.id)) {
			return interaction.reply(`You currently have ${currency.getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
		}

		const user = await Users.findOne({ where: { user_id: interaction.user.id } });
		currency.add(interaction.user.id, -item.cost);
		await user.addItem(item);

		return interaction.reply(`You've bought: ${item.name}.\nRemaining balance: ${currency.getBalance(interaction.user.id)}`);
	},
};