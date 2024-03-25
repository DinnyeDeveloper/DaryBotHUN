const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Éppen lejátszodó zene mutatása."),
    async execute(interaction, client) {
        const { member, guild } = interaction;
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

            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed.setColor("Red").setDescription("Nincs aktív várólista.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const song = queue.songs[0];
            const nowPlayingText = `🎶 **Ez szól most:** [${song.name}](${song.url}) - \`${song.formattedDuration}\`**`;

            embed.setColor("Blue").setDescription(nowPlayingText).setThumbnail(song.thumbnail);
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Hiba történt, kérjük próbála meg újra...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
