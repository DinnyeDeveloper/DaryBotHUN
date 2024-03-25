const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config(); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dm')
		.setDescription('Send a DM to a user!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user that should get DMed')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('The message that the user should recieve')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for the DM')),
	async execute(interaction) {
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
    try {
		const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');
        const reason = interaction.options.getString('reason');
        const erroremoji = process.env.errorEmoji;
        const ixEmoji = process.env.ixEmoji;
 
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL() || `https://cdn.discordapp.com/attachments/1160586532395171851/1185543134608904233/6239226.png` })
            .setColor(0x82272a)
            .setTitle(`\`👷‍♂️\` Fejlesztői üzenet`)
            .addFields(
                { name: `\`📝\` Üzenet`, value: ` \`${message}\` ` },
                //{ name: '💻 Server', value: `${interaction.guild.name}` },
                { name: `\`🔨\` Indok`, value: reason || `${ixEmoji} Nincs indok megadva` },
                { name: `\`👷‍♂️\` Fejlesztő`, value: `${interaction.user}` },
            )
            .setTimestamp();
 
            await user.send({ embeds: [embed] })
                .then(() => {
                    interaction.reply({ content: `>>> ${erroremoji} Az üzenetet elküldtem neki, ${user.tag}!` });
                })
                .catch(() => {
                    interaction.reply({ content: `>>> ${erroremoji} A felhasználó ${user.tag} nem engedélyezi a privát üzeneteket!` });
                });
            } catch (error) {
                console.error(error);
                await interaction.reply('Hiba történt az üzenet elküldése közben.');
              }
	},
};