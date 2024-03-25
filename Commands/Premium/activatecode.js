const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const PremiumCode = require('../../Models/PremiumCode');
const PremiumUser = require('../../Models/Premium');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activatecode')
        .setDescription('Aktivál egy premium rendszer redeem kódot')
        .addStringOption(option =>
            option.setName('activation_key')
                .setDescription('A redeem kód aktiváláshoz szükséges')
                .setRequired(true)
        ),

    async execute(interaction) {
        const activationKey = interaction.options.getString('activation_key');
        const premiumlogo = process.env.premiumlogo;
        const premiumemoji = process.env.premium;

        try {
            // Ellenőrzi, hogy a kód létezik-e
            const code = await PremiumCode.findOne({ activationKey });
            if (!code) {
                return interaction.reply('A megadott redeem kód érvénytelen.');
            }

            // Ellenőrzi, hogy a felhasználó már a premium adatbázisban van-e
            let user = await PremiumUser.findOne({ discordId: interaction.user.id });
            if (!user) {
                // Ha nincs, létrehozza a felhasználót
                user = new PremiumUser({
                    discordId: interaction.user.id,
                    username: interaction.user.username,
                    premium: {
                        isEnabled: false,
                        expirationDate: new Date(),
                    },
                });
            }

            // Ellenőrzi, hogy a felhasználónak van-e már premiumja
            if (user.premium.isEnabled && user.premium.expirationDate > new Date()) {
                // Ha van, hozzáadja az új időt az aktuális lejárati dátumhoz
                const newExpirationDate = new Date(user.premium.expirationDate.getTime() + code.durationInDays * 24 * 60 * 60 * 1000);
                user.premium.expirationDate = newExpirationDate;
            } else {
                // Ha nincs, beállítja az új időt a jelenlegi dátumhoz
                user.premium.isEnabled = true;
                user.premium.expirationDate = new Date();
                user.premium.expirationDate.setDate(user.premium.expirationDate.getDate() + code.durationInDays);
            }

            // Törli a felhasznált kódot az adatbázisból
            await PremiumCode.findOneAndDelete({ activationKey });

            // Mentés az adatbázisba
            await user.save();

            // Visszajelzés küldése
            const embed = new EmbedBuilder()
                .setColor(0x82272a) // Zöld szín
                .setTitle(`${premiumemoji} Premium rendszer sikeresen aktiválva.`)
                .addFields([
                    { name: '\`👤\`' + ' Felhasználó', value: "`" + `${interaction.user.username}` + "`", inline: true },
                    { name: '\`⏰\`' + ' Idő', value: "`" + `${code.durationInDays} nap` + "`", inline: true },
                    { name: '\`📅\`' + ' lejárati dátum', value: "`" + `${user.premium.expirationDate.toISOString().split('T')[0]}` + "`", inline: true },
                    { name: '\`💫\`' + ' Kategória', value: "`" + `Felhasználók számára` + "`", inline: true },
                ])
                .setThumbnail(`${premiumlogo}`);

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a kód aktiválása során.');
        }
    },
};
