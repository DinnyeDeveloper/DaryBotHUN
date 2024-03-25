const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const PremiumCodeGuild = require('../../Models/PremiumCodeGuild');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteguildcode')
        .setDescription('Törli a premium rendszer redeem kódot')
        .addStringOption(option =>
            option.setName('activation_key')
                .setDescription('A törlendő redeem kód aktivációs kulcsa')
                .setRequired(true)
        ),

    async execute(interaction, client) {

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

        try {
            // Ellenőrzi, hogy a kód létezik-e
            const existingCode = await PremiumCodeGuild.findOne({ activationKey });
            if (!existingCode) {
                return interaction.reply('A megadott redeem kód nem található.');
            }

            // Törli a redeem kódot az adatbázisból
            await PremiumCodeGuild.findOneAndDelete({ activationKey });

            // Visszajelzés küldése
            const embed = new EmbedBuilder()
                .setColor(0x82272a) // Zöld szín
                .setTitle(`Premium rendszer redeem kód törölve`)
                .addFields([
                    { name: '\`🔑\`' + ' Aktivációs kulcs', value: "```" + `${activationKey}` + "```", inline: true },
                    { name: '\`💫\`' + ' Kategória', value: "`" + `Szerverek számára` + "`", inline: true },
                ])
                .setThumbnail(`${premiumlogo}`);

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a kód törlése során.');
        }
    },
};
