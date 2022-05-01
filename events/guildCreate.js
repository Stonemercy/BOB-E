module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		const { MessageEmbed, Permissions } = require('discord.js');
		const { Guilds } = require('../guildDB/guilddbObjects.js');
		const guildID = await Guilds.findOne({ where: { guild_id: guild.id } });
		const welcomeEmbed = new MessageEmbed()
			.setColor('#87ceeb')
			.setTitle('Thanks for inviting my bot!')
			.setURL('https://stonemercy.github.io/BOB-E/')
			.setAuthor({ name: 'Stonemercy' })
			.setDescription('I\'m working hard on making sure this bot runs well!\nHere is how to set it up:')
			.addFields(
				{ name: '/setup', value: 'Use this command while inputting the following data:' },
				{ name: 'Webhook ID', value: 'This is the ID of your webhook' },
				{ name: 'Webhook Channel ID', value: 'The channel where your webhook posts when people go on/offline' },
				{ name: 'Staff role ID', value: 'Self explanatory' },
				{ name: 'Shop channel ID', value: 'Self explanatory' },
			)
			.setImage('https://c.tenor.com/uocxTQoo0qoAAAAC/catthankyou-cat.gif')
			.setTimestamp()
			.setFooter({ text: 'Support me at t.tv/stonemercy' });


		if (guildID && guildID.guild_id == guild.id) {
			return console.log(`Server "${guild.name}" reinvited the bot.`);
		}
		else if (guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG) && !guildID) {
			const auditLogFetch = await guild.fetchAuditLogs({ limit: 1, type:'BOT_ADD' }).then(audit => audit.entries.first());
			const inviterID = await auditLogFetch.executor.id;
			const user = await guild.members.fetch(inviterID);
			user.send({ embeds: [welcomeEmbed] });
		}
		else {
			guild.ownerId.send({ embeds: [welcomeEmbed] });
		}
		await Guilds.create({ guild_id: guild.id });
		console.log(`New server added: ${guild.name}`);
	},
};
