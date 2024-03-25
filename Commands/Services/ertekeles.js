const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
require('dotenv').config();
const Dennyel = process.env.devid;
const Andris = process.env.devid2;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ertekeles")
        .setDescription("Ertekelni tudod a staff csapat munkáját!")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("stars")
                .setDescription("Mennyi csillagot adsz.")
                .addChoices(
                    { name: "⭐", value: "⭐" },
                    { name: "⭐⭐", value: "⭐⭐" },
                    { name: "⭐⭐⭐", value: "⭐⭐⭐" },
                    { name: "⭐⭐⭐⭐", value: "⭐⭐⭐⭐" },
                    { name: "⭐⭐⭐⭐⭐", value: "⭐⭐⭐⭐⭐" }
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("description")
                .setDescription("leírás")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("options")
                .setDescription("Kinek akarod adni a(z) értékelés?")
                .addChoices(
                    { name: "Dennyel", value: `<@${Dennyel}>` },
                    { name: "Andris", value: `<@${Andris}>` },
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member } = interaction;

        const stars = options.getString("stars");
        const description = options.getString("description");
        const option = options.getString("options");

        const channel = member.guild.channels.cache.get("1163372561413984276");
        const customer = member.roles.cache.has("1163077862866288651");

        const embed = new EmbedBuilder();

        if (!customer) {
            embed.setColor("Red")
                .setTimestamp()
                .setDescription("You are not a registered customer.")
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        embed
            .addFields(
                { name: "Developer", value: `${option}_ _`, inline: true },
                { name: "Stars", value: `${stars}`, inline: true },
                { name: "Review", value: `${description}\n` },
            )
            .setColor(0x235ee7)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [embed] });

        embed.setDescription(`You review was succesfully sent in ${channel}!\n\n**Preview:** `).setColor(0x235ee7);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}