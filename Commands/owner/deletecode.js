const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const PremiumCode = require('../../Models/PremiumCode');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletecode')
        .setDescription('Törli a megadott premium rendszer redeem kódot')
        .addStringOption(option =>
            option.setName('activation_key')
                .setDescription('A törlendő redeem kód aktiváláshoz szükséges')
                .setRequired(true)
        ),

    async execute(interaction) {

        const allowedUserIds = [
            process.env.devid,
            process.env.devid2,
            process.env.devid3,
        ];
        if (!allowedUserIds.includes(interaction.user.id)) {
            // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
            await interaction.reply("Nincs engedélyed használni ezt a parancsot.");
            return;
        }

        const activationKey = interaction.options.getString('activation_key');
        const premiumlogo = process.env.premiumlogo;
        const premiumemoji = process.env.premium;

        try {
            // Ellenőrzi, hogy a kód létezik-e
            const code = await PremiumCode.findOne({ activationKey });
            if (!code) {
                return interaction.reply('A megadott redeem kód nem található.');
            }

            // Törli a kódot az adatbázisból
            await PremiumCode.findOneAndDelete({ activationKey });

            // Visszajelzés küldése
            const embed = new EmbedBuilder()
                .setColor(0x82272a) // Zöld szín
                .setTitle(`${premiumemoji} Premium rendszer redeem kód törölve.`)
                .addFields([
                    { name: '\`🔑\`' + ' Aktivációs kulcs', value: "```" + `${activationKey}` + "```", inline: true },
                    { name: '\`💫\`' + ' Kategória', value: "`" + `Felhasználók számára` + "`", inline: true },
                ])
                .setThumbnail(`${premiumlogo}`);

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a kód törlése során.');
        }
    },
};
