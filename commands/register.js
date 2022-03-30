const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Tie your Steam ID to your Discord account')
		.addStringOption(option =>
			option
				.setName('steamid')
				.setDescription('Your Steam ID')
				.setRequired(true)),
	async execute(interaction) {
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const userID = interaction.user.id;
		const steamIdToCheck = interaction.options.getString('steamid');
		const steamIDChecker = /\d{17}/g;
		const steamId = steamIdToCheck.match(steamIDChecker);
		const { Guilds } = require('../guildDB/guilddbObjects');
		const shopChannel = await Guilds.findOne({ where: { guild_id: interaction.guildId } });

		if (!shopChannel) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== shopChannel.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${shopChannel.shop_channel_id}>`, ephemeral: true });
		}
		else if (!steamId) {
			return interaction.reply({ content: 'You did not supply a proper steam ID (17 digits)', ephemeral: true });
		}
		else {
			await Users.upsert({ user_id: userID, steam_id: steamId });
			return interaction.reply(`Successfully added ${steamId} as your steam id!`);
		}

	},
};