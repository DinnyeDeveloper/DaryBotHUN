// activatecode.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const PremiumCodeGuild = require('../../Models/PremiumCodeGuild');
const PremiumGuild = require('../../Models/PremiumGuild');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activateguildcode')
        .setDescription('Aktivál egy premium rendszer redeem kódot')
        .addStringOption(option =>
            option.setName('activation_key')
                .setDescription('A redeem kód aktiváláshoz szükséges')
                .setRequired(true)
        ),

    async execute(interaction) {
        const activationKey = interaction.options.getString('activation_key');
        const guildId = interaction.guild.id; // Az aktuális szerver ID-ja
        const premiumlogo = process.env.premiumlogo;
        const premiumemoji = process.env.premium;

        try {
            // Ellenőrzi, hogy a kód létezik-e a szerveren
            const code = await PremiumCodeGuild.findOne({ activationKey });
            if (!code) {
                return interaction.reply('A megadott redeem kód érvénytelen.');
            }

            // Ellenőrzi, hogy a szerver már a prémium adatbázisban van-e
            let guild = await PremiumGuild.findOne({ guildId });
            if (!guild) {
                // Ha nincs, létrehozza a szerver adatokat
                guild = new PremiumGuild({
                    guildId,
                    premium: {
                        isEnabled: false,
                        expirationDate: new Date(),
                    },
                });
            }

            // Ellenőrzi, hogy a szervernek van-e már prémiumja
            if (guild.premium.isEnabled && guild.premium.expirationDate > new Date()) {
                // Ha van, hozzáadja az új időt az aktuális lejárati dátumhoz
                const newExpirationDate = new Date(guild.premium.expirationDate.getTime() + code.durationInDays * 24 * 60 * 60 * 1000);
                guild.premium.expirationDate = newExpirationDate;
            } else {
                // Ha nincs, beállítja az új időt a jelenlegi dátumhoz
                guild.premium.isEnabled = true;
                guild.premium.expirationDate = new Date();
                guild.premium.expirationDate.setDate(guild.premium.expirationDate.getDate() + code.durationInDays);
            }

            // Törli a felhasznált kódot az adatbázisból
            await PremiumCodeGuild.findOneAndDelete({ activationKey });

            // Mentés az adatbázisba
            await guild.save();

            // Visszajelzés küldése
            const embed = new EmbedBuilder()
                .setColor(0x82272a) // Zöld szín
                .setTitle(`${premiumemoji} Premium rendszer sikeresen aktiválva.`)
                .addFields([
                    { name: '\`👤\`' + ' Szerver', value: "`" + `${interaction.guild.name}` + "`", inline: true },
                    { name: '\`⏰\`' + ' Idő', value: "`" + `${code.durationInDays} nap` + "`", inline: true },
                    { name: '\`📅\`' + ' lejárati dátum', value: "`" + `${guild.premium.expirationDate.toISOString().split('T')[0]}` + "`", inline: true },
                    { name: '\`💫\`' + ' Kategória', value: "`" + `Szerverek számára` + "`", inline: true },
                ])
                .setThumbnail(`${premiumlogo}`);

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a kód aktiválása során.');
        }
    },
};
