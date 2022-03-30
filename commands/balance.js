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
		const { currency } = require('../index.js');
		const target = interaction.options.getUser('user') ?? interaction.user;
		const { Guilds } = require('../guildDB/guilddbObjects');
		const shopChannel = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		Reflect.defineProperty(currency, 'getBalance', {
			value: id => {
				const user = currency.get(id);
				return user ? user.balance : 0;
			},
		});

		if (!shopChannel) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== shopChannel.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${shopChannel.shop_channel_id}>`, ephemeral: true });
		}
		else {
			return interaction.reply(`<@${target.id}> has ${currency.getBalance(target.id)}💰`);
		}

	},
};