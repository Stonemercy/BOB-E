const { SlashCommandBuilder } = require('@discordjs/builders');
const SteamAPI = require('steamapi');
const { steamKey } = require('../config.json');
const steam = new SteamAPI(steamKey);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Link your Steam ID to your Discord account')
		.addStringOption(option =>
			option
				.setName('steamid')
				.setDescription('Your Steam ID')
				.setRequired(true)),
	async execute(interaction) {
		const { MessageEmbed } = require('discord.js');
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const steamIdToCheck = interaction.options.getString('steamid');
		const steamIDChecker = /\d{17}/g;
		const steamId = steamIdToCheck.match(steamIDChecker);
		const { Guilds } = require('../guildDB/guilddbObjects');
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const currentUser = await Users.findOne({ where: { user_id: interaction.user.id, guild_id: interaction.guildId } });

		if (steamIdToCheck.length < 17) {
			return interaction.reply({ content: `Your provided steam ID was only ${steamIdToCheck.length} digit/s long\nYou need to supply a steam ID that is 17 digits long`, ephemeral: true });
		}

		const steamPromise = await steam.getUserSummary(steamId);
		const steamProfile = steamPromise[0];

		const steamEmbed = new MessageEmbed()
			.setColor('GREY')
			.setTitle(`Username: ${steamProfile.nickname}`)
			.setURL(steamProfile.url)
			.setImage(steamProfile.avatar.medium);


		if (steamProfile.gameID) {
			const gameName = await steam.getGameDetails(steamProfile.gameID);
			steamEmbed.addField('Currently playing:', gameName.name);
		}
		else {
			steamEmbed.addField('Currently playing:', 'Nothing');
		}

		switch (steamProfile.personaState) {
		case 0:
			steamEmbed.addField('Status:', 'Offline');
			break;

		case 1:
			steamEmbed.addField('Status:', 'Online');
			steamEmbed.setColor('GREEN');
			break;

		case 2:
			steamEmbed.addField('Status:', 'Busy');
			steamEmbed.setColor('RED');
			break;

		case 3:
			steamEmbed.addField('Status:', 'Away');
			steamEmbed.setColor('YELLOW');
			break;
		}

		if (!currentGuild.shop_channel_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else if (!currentUser) {
			await Users.create({
				user_id: interaction.user.id,
				username: interaction.user.tag,
				guild_id: interaction.guildId,
			});
		}
		else {
			await currentUser.update({ steam_id: String(steamId) });
			return interaction.reply({ embeds: [steamEmbed], content: `Successfully added **${steamId}** as your steam id\nPlease check the following information is correct:`, ephemeral: true });
		}

	},
};