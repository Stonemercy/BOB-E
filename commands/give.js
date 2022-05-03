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
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const currentUser = await Users.findOne({ where: { guild_id: interaction.guildId, user_id: interaction.user.id } });
		const transferAmount = interaction.options.getInteger('amount');
		const transferTarget = interaction.options.getUser('user');
		const targetUser = await Users.findOne({ where: { user_id: transferTarget.id, guild_id: interaction.guildId } });

		if (!currentGuild.shop_channel_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else if (transferTarget.id === interaction.user.id) {
			return interaction.reply({ content: 'You can\'t give money to yourself!', ephemeral: true });
		}
		else if (transferAmount <= 0) {
			return interaction.reply({ content: `Please enter an amount greater than zero, ${interaction.user}.`, ephemeral: true });
		}
		else if (transferAmount > currentUser.balance) {
			return interaction.reply(`Sorry ${interaction.user}, you can't give ${currentGuild.shop_currency} ${transferAmount} when you only have ${currentGuild.shop_currency} ${currentUser.balance}.`);
		}
		else if (targetUser === null) {
			await currentUser.update({ balance: currentUser.balance -= Number(transferAmount) });
			await Users.create({ user_id: transferTarget.id, username: transferTarget.tag, guild_id: interaction.guildId, balance: Number(transferAmount) });
			return interaction.reply(`Successfully transferred ${currentGuild.shop_currency}${transferAmount} to ${transferTarget.tag}.\nYour new balance is ${currentGuild.shop_currency} ${currentUser.balance}`);
		}
		else {
			await currentUser.update({ balance: currentUser.balance -= Number(transferAmount) });
			await targetUser.update({ balance: targetUser.balance += Number(transferAmount) });
			return interaction.reply(`Successfully transferred ${currentGuild.shop_currency}${transferAmount} to ${transferTarget.tag}.\nYour new balance is ${currentGuild.shop_currency} ${currentUser.balance}`);
		}

	},
};