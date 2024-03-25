const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Berakott zenék listája."),
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;

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

            const songsList = queue.songs.map((song, id) => `\n**${id + 1}.** ${song.name} -\`${song.formattedDuration}\``);
            const truncatedList = songsList.join('').slice(0, 4096); // Truncate to fit within Discord limit

            embed.setColor("Purple").setDescription(truncatedList);
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Hiba történt, kérjük próbálja meg újra...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}