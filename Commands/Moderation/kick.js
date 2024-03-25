const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
require('dotenv').config();

module.exports = {
    moderatorOnly: true,
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Ki tudsz dobni valakit a szerverről.")
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Tag akit ki akarsz dobni.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Indok.")
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser("target");
        const reason = options.getString("reason") || `${process.env.errorEmoji} Nincs indok.`;

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`${process.env.ixEmoji} A(z) ${user.username}-nek magasabb rangja van. Így nem tudod kitíltani.`)
            .setColor(0xc72c3b)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setDescription(`${process.env.pipaEmoji} Sikeresen kidobtad őt: ${user}.`)
            .addFields(
                { name: `\`📃\` **Indok**`, value: `${reason}`, inline: true },
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(0x5fb041)
            .setTimestamp()

        await interaction.reply({
            embeds: [embed]
        });
    }
}