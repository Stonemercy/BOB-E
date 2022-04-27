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
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('How much you want to give them')
				.setRequired(true)),
	async execute(interaction) {
		const { Users } = require ('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects.js');
		const { owner } = require('../config.json');
		const currentUser = await Users.findOne({ where: { user_id: interaction.user.id, guild_id: interaction.guildId } });
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const targetUser = interaction.options.getUser('user');
		const currencyAmount = interaction.options.getInteger('amount');
		const targetUserDb = await Users.findOne({ where: { user_id: targetUser.id, guild_id: interaction.guildId } });

		if (!currentGuild.staff_role_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (!interaction.member.roles.cache.some(role => role.id === currentGuild.staff_role_id)) {
			return interaction.reply('You don\'t have permission to do that!');
		}
		else if (currencyAmount <= 0) {
			if (interaction.user.id === owner && targetUserDb !== null) {
				await currentUser.update({ balance: currentUser.balance += Number(currencyAmount) });
				return interaction.reply(`Successfully edited ${targetUser}'s currency by: ${currentGuild.shop_currency}${currencyAmount}`);
			}
			else if (targetUserDb !== null) {
				return interaction.reply('You can\'t add negative or nil amounts!');
			}
		}
		else if (targetUserDb === null) {
			await Users.create({ user_id: targetUser.id, username: targetUser.tag, guild_id: interaction.guildId });
			const newUser = await Users.findOne({ where: { user_id: targetUser.id, guild_id: interaction.guildId } });
			await newUser.update({ balance: newUser.balance += Number(currencyAmount) });
			return interaction.reply(`Successfully added ${currentGuild.shop_currency}${currencyAmount} to ${targetUser}`);

		}
		else {
			await targetUserDb.update({ balance: targetUserDb.balance += Number(currencyAmount) });
			return interaction.reply(`Successfully added ${currentGuild.shop_currency}${currencyAmount} to ${targetUser}`);
		}
	},
};