const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { connect } = require("mongoose");
const User = require("../../Models/Premium");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premiumuser-info')
        .setDescription('Megnézheti, hogy egy adott embernek van-e prémiuma.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Jelölj meg egy felhasználót.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        try {
            const dbUser = await User.findOne({ discordId: user.id });

            if (dbUser) {
                const premiumStatus = dbUser.premium.isEnabled
                    ? `Aktív | ${formatDate(dbUser.premium.expirationDate)}`
                    : "Nem aktív.";
                const premiumdowntime = dbUser.premium.isEnabled
                    ? `${formatDate(dbUser.premium.expirationDate)}`
                    : "---";

                const embed = new EmbedBuilder()
                    .setTitle('User Information')
                    .setThumbnail(user.displayAvatarURL())
                    .addFields(
                        { name: `\`👤\` **Felhasználónév**`, value: dbUser.username, inline: true },
                        { name: `\`🆔\` **Discord ID**`, value: dbUser.discordId, inline: true },
                        { name: `\`⭐\` **Premium Státusz**`, value: premiumStatus, inline: false },
                        { name: `\`⏰\` **Lejárat dátuma**`, value: premiumdowntime, inline: false },
                    )
                    .setColor('#3498db');

                await interaction.reply({
                    embeds: [embed],
                });
            } else {
                // Create a new user entry in the database
                const newUser = new User({
                    discordId: user.id,
                    username: user.username,
                    premium: {
                        isEnabled: false,
                        expirationDate: null,
                    },
                });

                await newUser.save();
                const newpremiumuser = "Nem aktív.";

                const embed = new EmbedBuilder()
                    .setTitle('User Information')
                    .setThumbnail(user.displayAvatarURL())
                    .addFields(
                        { name: `\`👤\` **Felhasználónév**`, value: user.username, inline: true },
                        { name: `\`🆔\` **Discord ID**`, value: user.discordId, inline: true },
                        { name: `\`⭐\` **Premium Státusz**`, value: `${newpremiumuser}`, inline: true },
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
