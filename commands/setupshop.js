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
								.setName('item-edit')
								.setDescription('The item that\'s in your shop')
								.setRequired(true))
						.addStringOption(option =>
							option
								.setName('update-name')
								.setDescription('Updates the item\'s name'))
						.addIntegerOption(option =>
							option
								.setName('update-cost')
								.setDescription('Updates the item\'s cost')))
				.addSubcommand(subcommand =>
					subcommand
						.setName('remove')
						.setDescription('Remove the item from your shop')
						.addStringOption(option =>
							option
								.setName('item-remove')
								.setDescription('The item you wish to remove')
								.setRequired(true)))),
	async execute(interaction) {
		const newItem = [interaction.options.getString('item-name'), interaction.options.getInteger('item-cost')];
		const updateItem = interaction.options.getString('item-edit');
		const updatedName = interaction.options.getString('update-name');
		const updatedCost = interaction.options.getInteger('update-cost');
		const removeItem = interaction.options.getString('item-remove');
		const guildCurrency = interaction.options.getString('currency-icon');
		const { Op } = require('sequelize');
		const { Guilds } = require('../guildDB/guilddbObjects.js');
		const { CurrencyShop, UserItems } = require('../currencyShopDB/csDBObjects.js');
		const currentGuild = await Guilds.findOne({ where: { guild_id: interaction.guildId } });
		const newItemCheck = await CurrencyShop.findOne({ where: { guild_id: interaction.guildId, name: { [Op.like]: newItem[0] } } });
		const removeItemCheck = await CurrencyShop.findOne({ where: { guild_id: interaction.guildId, name: { [Op.like]: removeItem } } });
		const updateItemCheck = await CurrencyShop.findOne({ where: { guild_id: interaction.guildId, name: { [Op.like]: updateItem } } });

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
		else if (newItemCheck === null && newItem[0] !== null) {
			await CurrencyShop.create({
				guild_id: interaction.guildId,
				name: newItem[0],
				cost: newItem[1] });
			return interaction.reply(`**Success!**\n\nItem name: ${newItem[0]}\nItem cost: ${currentGuild.shop_currency}${newItem[1]}`);
		}
		else if (newItemCheck !== null && newItemCheck.name === newItem[0]) {
			return interaction.reply('**Something went wrong**\nIt seems like that item is already in your shop\nPlease use the **/setupshop items edit** to edit it');
		}
		else if (updateItemCheck !== null && updatedCost) {
			await CurrencyShop.update({ cost: updatedCost }, {
				where: {
					guild_id: interaction.guildId, name: { [Op.like]: updateItem },
				},
			});
			return interaction.reply(`**Success**\n**${updateItem}** has had it's cost changed to **${updatedCost}**`);
		}
		if (updateItemCheck !== null && updatedName) {
			await CurrencyShop.update({ name: updatedName }, {
				where: {
					guild_id: interaction.guildId, name: { [Op.like]: updateItem },
				},
			});
			return interaction.reply(`**Success**\n**${updateItem}** has had it's name changed to **${updatedName}**`);
		}
		else if (removeItemCheck !== null && removeItem) {
			await CurrencyShop.destroy({ where: { guild_id: interaction.guildId, name: removeItem } });
			await UserItems.destroy({ where: { guild_id: interaction.guildId, item_name: removeItem } });
			return interaction.reply(`**${removeItem}** has been successfully removed from your shop and all users that had one`);
		}
		else {
			return interaction.reply('I had trouble finding that item, make sure you spelled it correctly and that it exists in your shop');
		}
	},
};