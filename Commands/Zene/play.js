const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Zene indítása.")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Adja meg a dal nevét vagy url-jét.")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;

        const query = options.getString("query");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("A zenei parancsok végrehajtásához hangcsatornán kell lennie.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`Nem tudod használni a zenelejátszót, mivel az már aktív a <#${guild.members.me.voice.channelId}>-ban.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
            return interaction.reply({ content: `>>> ${process.env.zeneStartEmoji} Zene elindítva.` });

        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Hiba történt.");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}