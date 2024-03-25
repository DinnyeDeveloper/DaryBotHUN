const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { connect } = require("mongoose");
const Guild = require("../../Models/PremiumGuild");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premiumserver-info')
        .setDescription('Megnézheti, hogy egy adott szervernek van-e prémiuma.')
        .addStringOption(option => option
            .setName('guild')
            .setDescription('Jelölj meg egy szerver ID-t.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const guildId = interaction.options.getString('guild');

        try {
            const dbGuild = await Guild.findOne({ guildId });

            if (dbGuild) {
                const premiumStatus = dbGuild.premium.isEnabled
                    ? `Aktív | ${formatDate(dbGuild.premium.expirationDate)}`
                    : "Nem aktív.";
                const premiumdowntime = dbGuild.premium.isEnabled
                    ? `${formatDate(dbGuild.premium.expirationDate)}`
                    : "---";

                const embed = new EmbedBuilder()
                    .setTitle('Server Information')
                    .addFields(
                        { name: `\`🆔\` **Server ID**`, value: guildId, inline: true },
                        { name: `\`⭐\` **Premium Státusz**`, value: premiumStatus, inline: false },
                        { name: `\`⏰\` **Lejárat dátuma**`, value: premiumdowntime, inline: false },
                    )
                    .setColor('#3498db');

                await interaction.reply({
                    embeds: [embed],
                });
            } else {
                // Create a new guild entry in the database if it doesn't exist
                const newGuild = new Guild({
                    guildId: guildId,
                    premium: {
                        isEnabled: false,
                        expirationDate: null,
                    },
                });

                await newGuild.save();
                const newpremiumguild = "Nem aktív.";

                const embed = new EmbedBuilder()
                    .setTitle('Server Information')
                    .addFields(
                        { name: `\`🆔\` **Server ID**`, value: guildId, inline: true },
                        { name: `\`⭐\` **Premium Státusz**`, value: newpremiumguild, inline: false },
                    )
                    .setColor('#3498db');

                await interaction.reply({
                    embeds: [embed],
                });
            }
        } catch (error) {
            console.error(error);
            interaction.reply('HIBA történt.');
        }
    },
};

// Függvény a dátum formázására (YYYY/MM/DD - HH/MM)
function formatDate(date) {
    if (!date) return "Nincs prémium";
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('hu', options).format(date);
}
