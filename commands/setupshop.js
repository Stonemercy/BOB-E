const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setupshop')
		.setDescription('Setup the shop for your server')
		.addSubcommandGroup(subcommandgroup =>
			subcommandgroup
				.setName('icon')
				.setDescription('Set/update your shop currency icon')
				.addSubcommand(subcommand =>
					subcommand
						.setName('set')
						.setDescription('Set the custom currency icon for your server (default is 💰)')
						.addStringOption(option =>
							option
								.setName('currency-icon')
								.setDescription('Your custom currency icon')
								.setRequired(true))))
		.addSubcommandGroup(subcommandgroup =>
			subcommandgroup
				.setName('items')
				.setDescription('Your shop items')
				.addSubcommand(subcommand =>
					subcommand
						.setName('add')
						.setDescription('Adds an item')
						.addStringOption(option =>
							option
								.setName('item-name')
								.setDescription('Item\'s name')
								.setRequired(true))
						.addIntegerOption(option =>
							option
								.setName('item-cost')
								.setDescription('Item\'s cost')
								.setRequired(true)))
				.addSubcommand(subcommand =>
					subcommand
						.setName('edit')
						.setDescription('Edit an existing item')
						.addStringOption(option =>
							option
								.setName('current-item')
								.setDescription('The item that\'s in your shop')
								.setRequired(true))
						.addStringOption(option =>
							option
								.setName('update-name')
								.setDescription('Updates the item\'s name'))
						.addIntegerOption(option =>
							option
								.setName('update-cost')
								.setDescription('Updates the item\'s cost')))),
	async execute(interaction) {
		const newItem = [interaction.options.getString('item-name'), interaction.options.getInteger('item-cost')];
		const updateItem = interaction.options.getString('current-item');
		const updatedName = interaction.options.getString('update-name');
		const updatedCost = interaction.options.getInteger('update-cost');
		const guildCurrency = interaction.options.getString('currency-icon');
		const { Op } = require('sequelize');
		const { Guilds } = require('../guildDB/guilddbObjects.js');
		const { CurrencyShop } = require('../currencyShopDB/csDBObjects.js');
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const itemCheck = await CurrencyShop.findOne({ where: { guild_id: interaction.guildId, name: updateItem || newItem[0] } });

		if (!currentGuild) {
			return interaction.reply('Looks like you haven\'t set up my bot yet, please do so by running the **/setup** command!');
		}
		else if (!interaction.member.roles.cache.has(currentGuild.staff_role_id)) {
			return interaction.reply('You don\'t have permission to do that!');
		}
		else if (guildCurrency) {
			await Guilds.upsert({
				guild_id: interaction.guildId,
				shop_currency: guildCurrency });
			return interaction.reply(`**Success!**\n\nNew currency icon: ${guildCurrency}`);
		}
		else if (itemCheck === null && newItem[0] !== null) {
			await CurrencyShop.create({
				guild_id: interaction.guildId,
				name: newItem[0],
				cost: newItem[1] });
			return interaction.reply(`**Success!**\n\nItem name: ${newItem[0]}\nItem cost: ${currentGuild.shop_currency}${newItem[1]}`);
		}
		else if (itemCheck !== null && itemCheck.name === newItem[0]) {
			return interaction.reply('**Something went wrong**\nIt seems like that item is already in your shop\nPlease use the **/setupshop items edit** to edit it');
		}
		else if (itemCheck !== null && updatedCost) {
			await CurrencyShop.update({ cost: updatedCost }, {
				where: {
					guild_id: interaction.guildId, name: { [Op.like]: updateItem },
				},
			});
			return interaction.reply(`**Success**\n**${updateItem}** has had it's cost changed to **${updatedCost}**`);
		}
		else if (!itemCheck) {
			return interaction.reply('I had trouble finding that item, make sure you spelled it correctly and that it exists in your shop');
		}
		if (itemCheck !== null && updatedName) {
			await CurrencyShop.update({ name: updatedName }, {
				where: {
					guild_id: interaction.guildId, name: { [Op.like]: updateItem },
				},
			});
			return interaction.reply(`**Success**\n**${updateItem}** has had it's name changed to **${updatedName}**`);
		}
	},
};