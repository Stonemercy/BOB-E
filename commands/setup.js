const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup the bot for your server')
		.addStringOption(option =>
			option
				.setName('webhook-id')
				.setDescription('The ID of your logon/off webhook')
				.setRequired(true))
		.addChannelOption(option =>
			option
				.setName('webhook-channel-id')
				.setDescription('The ID of your logon/off webhook')
				.setRequired(true))
		.addRoleOption(option =>
			option
				.setName('staff-role')
				.setDescription('Your Staff role')
				.setRequired(true))
		.addChannelOption(option =>
			option
				.setName('shop-channel')
				.setDescription('Your shop channel')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('currency-icon')
				.setDescription('The currency for your shop')),
	async execute(interaction) {
		const webhookId = interaction.options.getString('webhook-id');
		const webhookChannelId = interaction.options.getChannel('webhook-channel-id');
		const staffRoleId = interaction.options.getRole('staff-role');
		const shopChannelId = interaction.options.getChannel('shop-channel');
		const newCurrencyIcon = interaction.options.getString('currency-icon');
		const { Guilds } = require('../guildDB/guilddbObjects.js');
		const { CurrencyShop } = require('../currencyShopDB/csDBObjects.js');
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });

		if (currentGuild.staff_role_id && !interaction.member.roles.cache.has(currentGuild.staff_role_id)) {
			return interaction.reply('You don\'t have permission to do that!');
		}
		else {
			await Guilds.upsert({
				guild_id: interaction.guildId,
				webhook_id: webhookId,
				webhook_channel_id: webhookChannelId.id,
				staff_role_id: staffRoleId.id,
				shop_channel_id: shopChannelId.id,
				shop_currency: newCurrencyIcon || '💰' });
			await CurrencyShop.upsert({ guild_id: interaction.guildId });
			return interaction.reply(`**Success!**\nYour webhook is <@${webhookId}>\nIt should be posting logon/off info in <#${webhookChannelId.id}>\nYour staff role is <@&${staffRoleId.id}>\nYour shop channel is <#${shopChannelId.id}>\nand your shop currency is ${newCurrencyIcon || '💰'}\nFeel free to run this command again to update anything!`);
		}

	},
};