const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup the bot for your server')
		.addRoleOption(option =>
			option
				.setName('staffrole')
				.setDescription('Your Staff role')
				.setRequired(true))
		.addChannelOption(option =>
			option
				.setName('shopchannel')
				.setDescription('Your shop channel')
				.setRequired(true)),
	async execute(interaction) {
		// const { Permissions } = require('discord.js');
		const staffRoleId = interaction.options.getRole('staffrole');
		const shopChannelId = interaction.options.getChannel('shopchannel');
		const { Guilds } = require('../guildDB/guilddbObjects.js');

		/* if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return interaction.reply('You don\'t have permission to do that!');
		}*/

		if (!staffRoleId) {
			return interaction.reply('You have not supplied a proper role');
		}
		else if (!shopChannelId) {
			return interaction.reply('You have not supplied a proper channel');
		}
		else {
			await Guilds.upsert({ guild_id: interaction.guildId, staff_role_id: staffRoleId.id, shop_channel_id: shopChannelId.id });
			return interaction.reply(`**Success!**\nYour staff role is <@&${staffRoleId.id}>\nYour shop channel is <#${shopChannelId.id}>`);
		}

	},
};