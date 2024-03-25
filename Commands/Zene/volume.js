const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Hangerő modósítása.")
        .addIntegerOption(option =>
            option.setName("volume")
                .setDescription("10 = 10%")
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const { member, guild, options } = interaction;
        const volume = options.getInteger("volume");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("A zenei parancsok végrehajtásához hangcsatornán kell lennie.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`A zenei parancsokat nem tudja használni, mivel már aktív a(z) <#${guild.members.me.voice.channelId}> csatornán.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {

            client.distube.setVolume(voiceChannel, volume);
            return interaction.reply({ content: `>>> 🔉 A hangerő erre állítva: ${volume}%.` });

        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Hiba történt, kérjuk próbála meg újra...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}