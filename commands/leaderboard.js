const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the leaderboard'),
	async execute(interaction) {
		const { MessageEmbed } = require('discord.js');
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		function pageSplicer(arr, spliceSize) {
			const userPage = [];
			while (arr.length > 0) {
				const uPage = arr.splice(0, spliceSize);
				userPage.push(uPage);
			}
			return userPage;
		}

		if (!currentGuild.shop_channel_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else {
			const leaderboardEmbed = new MessageEmbed()
				.setColor('RED')
				.setTitle(`Leaderboard of "${interaction.guild.name}`);

			const guildUsers = await Users.findAll({ where: { guild_id: interaction.guildId }, order: [['balance', 'DESC']] });

			const lbPage = pageSplicer(guildUsers, 10);

			lbPage[0].map((i, index) => leaderboardEmbed.addField(index + 1 + ' - ' + i.username, currentGuild.shop_currency + ' ' + i.balance));

			return interaction.reply({ embeds: [leaderboardEmbed] });
		}
	},
};