const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Send money to someone else')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The transfer target')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The transfer amount')
				.setRequired(true)),
	async execute(interaction) {
		const { currency } = require('../index.js');
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const shopChannel = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		Reflect.defineProperty(currency, 'getBalance', {
			value: id => {
				const user = currency.get(id);
				return user ? user.balance : 0;
			},
		});
		const currentAmount = currency.getBalance(interaction.user.id);
		const transferAmount = interaction.options.getInteger('amount');
		const transferTarget = interaction.options.getUser('user');
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
		if (!shopChannel) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== shopChannel.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${shopChannel.shop_channel_id}>`, ephemeral: true });
		}
		else if (transferAmount > currentAmount) {
			return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`);
		}
		else if (transferAmount <= 0) {
			return interaction.reply(`Please enter an amount greater than zero, ${interaction.user}.`);
		}
		else {
			currency.add(interaction.user.id, -transferAmount);
			currency.add(transferTarget.id, transferAmount);
			return interaction.reply(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(interaction.user.id)}💰`);
		}

	},
};