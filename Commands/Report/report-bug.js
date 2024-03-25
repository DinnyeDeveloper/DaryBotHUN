const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("report-bug")
        .setDescription("Bugot tudsz jelenteni.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Mi a bug?')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const { channel, options } = interaction;

        const text = options.getString('text');
        const bugChannel = '1120835022090403872'; // Cseréld le a csatorna azonosítójára

        const bugChannelSend = client.channels.cache.get(bugChannel);

        if (bugChannelSend) {

            const bugReportEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `Dary`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle(`**Új Jelentés érkezett.**`)
                .setFields(
                    { name: `\`👤\` **Jelentő**`, value: `<@${interaction.user.id}>`, inline: true },
                    { name: `\`🔎\` **Szerver**`, value: `${interaction.guild.name}`, inline: true },
                )
                .setDescription(`\`🔎\` **Jelentés**\n${text}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(0xffae00)
            await bugChannelSend.send({ embeds: [bugReportEmbed] })
                }

                const bugReportEmbedDone = new EmbedBuilder()
                .setTitle(`**Ez remek.**`)
                .setDescription(`${process.env.pipaEmoji} Jelentésedet sikeresen elküldtük <@${interaction.user.id}>.`)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(0xffae00)

                await interaction.deferReply({ fetchReply: true })
                await interaction.editReply({ embeds: [bugReportEmbedDone] })
    }
}