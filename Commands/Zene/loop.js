const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Ismétlödő mód.")
        .addStringOption(option =>
            option.setName("options")
                .setDescription("Loop options: off, song, queue")
                .addChoices(
                    { name: "off", value: "off" },
                    { name: "song", value: "song" },
                    { name: "queue", value: "queue" },
                )
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const { member, options, guild } = interaction;
        const option = options.getString("options");
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

            let mode = null;

            switch (option) {
                case "off":
                    mode = 0;
                    break;
                case "song":
                    mode = 1;
                    break;
                case "queue":
                    mode = 2;
                    break;
            }

            mode = await queue.setRepeatMode(mode);

            mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";

            embed.setColor("Orange").setDescription(`>>> 🔁 Ismétlödő mód \`${mode}\`.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Hiba történt, kérjuk próbála meg újra...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

    }
}