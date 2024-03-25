const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
require('dotenv').config();

module.exports = {
    moderatorOnly: true,
    data: new SlashCommandBuilder()
        .setName("szavazas")
        .setDescription("Készíthetsz egy új szavazást egy adott csatornába.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Leírás.")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Melyik csatornába küldjem?")
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(interaction) {
        const { options, channel } = interaction;

        const pChannel = options.getChannel("channel") || channel;
        const description = options.getString("description");

        const embed = new EmbedBuilder()
            .setColor(0xffae00)
            .setTitle(`Új szavazás`)
            .setDescription(description)
            .setTimestamp();

        try {
            const m = await pChannel.send({ embeds: [embed] });
            pChannel.send("@everyone");
            await m.react(process.env.voteup);
            await m.react(process.env.votedown);
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`${process.env.pipaEmoji} | Szavazás elküldve id: ${pChannel}!`).setColor("Green")], ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}