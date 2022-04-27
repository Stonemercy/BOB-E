const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check your balance, or someone else\'s')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The person who\'s balance you want to check.')
				.setRequired(false)),
	async execute(interaction) {
		const { Users } = require ('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const target = interaction.options.getUser('user') ?? interaction.user;
		const targetDb = await Users.findOne({ where: { user_id: target.id, guild_id: interaction.guildId } });
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });

		if (currentGuild === null) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else if (targetDb === null) {
			await Users.create({ user_id: target.id, username: target.tag, guild_id: interaction.guildId });
			if (target.id === interaction.user.id) {
				const newUser = await Users.findOne({ where: { user_id: target.id, guild_id: interaction.guildId } });
				return interaction.reply(`You have ${currentGuild.shop_currency}${newUser.balance}`);
			}
			else {
				const newTarget = await Users.findOne({ where: { user_id: target.id, guild_id: interaction.guildId } });
				return interaction.reply(`<@${target.id}> has ${currentGuild.shop_currency}${newTarget.balance}`);
			}
		}
		else if (!interaction.options.getUser('user')) {
			return interaction.reply(`You have ${currentGuild.shop_currency} ${targetDb.balance}`);
		}
		else if (interaction.options.getUser('user') && targetDb) {
			return interaction.reply(`<@${target.id}> has ${currentGuild.shop_currency} ${targetDb.balance}`);
		}
	},
};