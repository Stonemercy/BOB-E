const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the leaderboard'),
	async execute(interaction) {
		const { Formatters } = require('discord.js');
		const { userCurrency } = require ('../index.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const shopChannel = await Guilds.findOne({ where: { guild_id: interaction.guildId } });

		if (!shopChannel) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== shopChannel.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${shopChannel.shop_channel_id}>`, ephemeral: true });
		}
		else {
			return interaction.reply(
				Formatters.codeBlock(
					userCurrency.sort((a, b) => b.balance - a.balance)
						.filter(user => interaction.client.users.cache.has(user.user_id))
						.first(10)
						.map((user, position) => `(${position + 1}) ${(interaction.client.users.cache.get(user.user_id).tag)}: <:vox_symbol:940510190443307009>${user.balance}`)
						.join('\n'),
				),
			);
		}
	},
};