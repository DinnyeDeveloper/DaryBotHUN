const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const PremiumCodeGuild = require('../../Models/PremiumCodeGuild');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getguildcodes')
        .setDescription('Lekéri a rendszerben elérhető szerver-specifikus premium kódokat'),

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

        const premiumlogo = process.env.premiumlogo;

        try {
            // Lekéri az összes rendelkezésre álló szerver-specifikus premium kódot az adatbázisból
            const codes = await PremiumCodeGuild.find();

            if (codes.length === 0) {
                return interaction.reply('Jelenleg nincs rendelkezésre álló szerver-specifikus premium kód.');
            }

            // Felépíti az embedet a kódok adataival
            const embed = new EmbedBuilder()
                .setColor(0x82272a) // Kék szín
                .setTitle('Rendelkezésre álló Szerver-specifikus Premium Kódok')
                .setThumbnail(`${premiumlogo}`);

            codes.forEach((code, index) => {
                embed.addFields(
                    { name: `Kód #${index + 1}`, value:  `\`🔑\` Aktivációs kulcs: \`\`\`${code.activationKey}\`\`\`\n\`⏰\` Idő: \`${code.durationInDays} nap\`\n\`👤\` Létrehozta: \`${code.createdBy}\`\n\`⏰\` Létrehozás dátuma: \`${code.createdAt.toISOString().split('T')[0]}\`\n━━━━━━━━━━━━━━`, inline: false}
                    );
            });

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a kódok lekérése során.');
        }
    },
};
