const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Sell an item for 75% of the original price')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('What you want to sell')
				.setRequired(true)),
	async execute(interaction) {
		const { currency } = require ('../index.js');
		const { Users, CurrencyShop, UserItems } = require ('../dbObjects.js');
		const { Op } = require('sequelize');
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
		const userItem = await UserItems.findOne({
			where: { user_id: interaction.user.id, item_id: item.id },
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

		if (!item) return interaction.reply('That item doesn\'t exist.');
		if (userItem.amount < 1) return interaction.reply({ content: 'You don\'t have that item', ephemeral: true });

		const user = await Users.findOne({ where: { user_id: interaction.user.id } });
		currency.add(interaction.user.id, item.cost * 0.75);
		await user.removeItem(item);

		return interaction.reply(`You've sold: ${item.name}.\nCurrent balance: ${currency.getBalance(interaction.user.id)}`);
	},
};