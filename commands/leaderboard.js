const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the leaderboard'),
	async execute(interaction) {
		const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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
			let pageNumber = 1;
			const leaderboardEmbed = new MessageEmbed()
				.setColor('RED')
				.setTitle(`Leaderboard of "${interaction.guild.name}"`)
				.setFooter({ text: `Page ${pageNumber}` });

			const guildUsers = await Users.findAll({ where: { guild_id: interaction.guildId }, order: [['balance', 'DESC']] });

			const lbPage = pageSplicer(guildUsers, 10);

			lbPage[0].map((i, index) => leaderboardEmbed.addField(index + 1 + ' - ' + i.username, currentGuild.shop_currency + ' ' + i.balance));

			const buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('previous-page')
						.setLabel('Previous Page')
						.setStyle('DANGER')
						.setDisabled(true),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('next-page')
						.setLabel('Next Page')
						.setStyle('PRIMARY'),
				);

			if (lbPage[1] !== undefined) {
				interaction.reply({ embeds: [leaderboardEmbed], components: [buttonRow] });
			}
			else {
				interaction.reply({ embeds: [leaderboardEmbed] });
			}

			const buttonCollector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

			buttonCollector.on('collect', async e => {
				if (e.user.id === interaction.user.id) {
					if (e.customId === 'next-page' && lbPage[pageNumber] !== undefined && leaderboardEmbed.footer.text === 'Page 1') {
						lbPage[pageNumber].map((i, index) => leaderboardEmbed.addField(index + 1 + ' - ' + i.username, currentGuild.shop_currency + ' ' + i.balance));
						leaderboardEmbed.setFooter({ text: `Page ${pageNumber}` });
						pageNumber++;
						buttonRow.customId('previous-page').setDisabled(false).setStyle('PRIMARY');
						await e.editReply({ embeds: [leaderboardEmbed], components: [buttonRow] });
					}
					else if (e.customId === 'previous-page' && lbPage[pageNumber - 1] !== undefined) {
						lbPage[pageNumber - 1].map((i, index) => leaderboardEmbed.addField(index + 1 + ' - ' + i.username, currentGuild.shop_currency + ' ' + i.balance));
						leaderboardEmbed.setFooter({ text: `Page ${pageNumber}` });
						pageNumber--;
						if (pageNumber === 1) {
							buttonRow.customId('previous-page').setDisabled(true).setStyle('DANGER');
						}
					}
				}
			});
			return;
		}
	},
};