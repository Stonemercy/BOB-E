const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Check your inventory, or someone else\'s'),
	async execute(interaction) {
		const { UserItems } = require('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const target = interaction.user;
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const targetItems = await UserItems.findAll({ where: { user_id: target.id, guild_id: interaction.guildId } });

		if (!currentGuild.shop_channel_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else if (!targetItems.length && target.id === interaction.user.id) {
			return interaction.reply('You have no items :(');
		}
		else if (target.id === interaction.user.id) {
			return interaction.reply(`You have: \n${targetItems.map(i => `${i.amount} - ${i.item_name}`).join('\n')}`);
		}
	},
};