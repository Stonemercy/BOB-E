const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('What you want to buy')
				.setRequired(true)),
	async execute(interaction) {
		const { CurrencyShop, UserItems, Users } = require ('../currencyShopDB/csDBObjects.js');
		const { Guilds } = require('../guildDB/guilddbObjects');
		const { Op } = require('sequelize');
		const itemName = interaction.options.getString('item');
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName }, guild_id: interaction.guildId } });
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const currentUser = await Users.findOne({ where: { user_id: interaction.user.id, guild_id: interaction.guildId } });

		if (!currentGuild.shop_channel_id) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (interaction.channelId !== currentGuild.shop_channel_id) {
			return interaction.reply({ content: `You need to use this in the designated shop channel: <#${currentGuild.shop_channel_id}>`, ephemeral: true });
		}
		else if (!item) {
			return interaction.reply('That item doesn\'t exist.');
		}
		else if (item.cost > currentUser.balance) {
			return interaction.reply(`You currently have ${currentGuild.shop_currency} ${currentUser.balance}, but the ${item.name} costs ${item.cost}!`);
		}
		else {
			await currentUser.update({ balance: currentUser.balance -= Number(item.cost) });

			const currentUserItem = await UserItems.findOne({ where: { user_id:interaction.user.id, guild_id:interaction.guildId, item_name: item.name } });
			if (currentUserItem) {
				await currentUserItem.update({ amount: currentUserItem.amount += Number(1) });
			}
			else {
				await UserItems.create({
					user_id: interaction.user.id,
					guild_id: interaction.guildId,
					item_name: item.name,
					amount: 1,
				});
			}

			return interaction.reply(`You've bought: **${item.name}**.\nRemaining balance: ${currentGuild.shop_currency} ${currentUser.balance}`);
		}

	},
};