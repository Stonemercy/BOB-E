const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announcement')
		.setDescription('OWNER USE ONLY')
		.addStringOption(option =>
			option
				.setName('announcement')
				.setDescription('The announcement')
				.setRequired(true)),
	async execute(interaction) {
		const { Guilds } = require('../guildDB/guilddbObjects');
		const { Op } = require('sequelize');
		const announcement = interaction.options.getString('announcement');
		const allGuilds = await Guilds.findAll({ where: { shop_channel_id: { [Op.not]: null } } });
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });

		if (!interaction.member.roles.cache.some(role => role.id === currentGuild.staff_role_id)) {
			return interaction.reply('Only the bot owner can use this command');
		}
		else {
			for (let i = 0; i < allGuilds.length; i++) {
				const guildShopChannel = await Guilds.findOne({ where: { id: i + 1 } });
				await interaction.client.channels.cache.get(guildShopChannel.shop_channel_id).send(announcement);
				interaction.reply(`Announcement sent to: ${guildShopChannel.guild_id}`);
			}
		} return interaction.reply('Announcements finished');
	},
};