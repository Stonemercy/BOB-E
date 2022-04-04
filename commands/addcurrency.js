const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcurrency')
		.setDescription('Add currency to a user\'s balance')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('Who you want to give currency to')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('amount')
				.setDescription('How much you want to give them')
				.setRequired(true)),
	async execute(interaction) {
		const { userCurrency } = require ('../index.js');
		const { Users } = require ('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const staffRoleId = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const targetUser = interaction.options.getUser('user');
		const currencyAmount = interaction.options.getString('amount');
		Reflect.defineProperty(userCurrency, 'add', {
			value: async (id, amount) => {
				const user = userCurrency.get(id);

				if (user) {
					user.balance += Number(amount);
					return user.save();
				}

				const newUser = await Users.create({ user_id: id, balance: amount });
				userCurrency.set(id, newUser);

				return newUser;
			},
		});

		if (!staffRoleId) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (!interaction.member.roles.cache.some(role => role.id === staffRoleId.staff_role_id)) {
			return interaction.reply('You don\'t have permission to do that!');
		}
		else if (currencyAmount < 0) {
			return interaction.reply('You can\'t add negative amounts!');
		}
		else {
			userCurrency.add(targetUser.id, currencyAmount);
			return interaction.reply(`Successfully added <:vox_symbol:940510190443307009>${currencyAmount} to ${targetUser}`);
		}
	},
};