const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Shows the shop'),
	async execute(interaction) {
		const { MessageEmbed } = require('discord.js');
		const { CurrencyShop } = require ('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const guildItems = await CurrencyShop.findAll({ where: { guild_id: interaction.guildId } });
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });

		if (!currentGuild.shop_channel_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else {
			const shopEmbed = new MessageEmbed()
				.setColor('#87ceeb')
				.setTitle(`The Shop of "${interaction.guild.name}"`);


			guildItems.map(i => shopEmbed.addField(i.name, currentGuild.shop_currency + i.cost));

			return interaction.reply({ embeds: [shopEmbed] });
		}
	},
};