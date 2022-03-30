const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Check your inventory, or someone else\'s')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The name of the person who\'s inventory you want to check')
				.setRequired(false)),
	async execute(interaction) {
		const { Users } = require('../currencyShopDB/csDBObjects.js');
		const target = interaction.options.getUser('user') ?? interaction.user;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();
		const { Guilds } = require('../guildDB/guilddbObjects');
		const shopChannel = await Guilds.findOne({ where: { guild_id: interaction.guildId } });

		if (!shopChannel) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== shopChannel.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${shopChannel.shop_channel_id}>`, ephemeral: true });
		}
		else if (!items.length) {
			return interaction.reply(`<@${target.id}> has nothing!`);
		}
		else {
			return interaction.reply(`<@${target.id}> currently has: \n${items.map(i => `${i.amount} ${i.item.name}`).join('\n')}`);
		}


	},
};