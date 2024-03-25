// createcode.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const PremiumCodeGuild = require('../../Models/PremiumCodeGuild');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createguildcode')
        .setDescription('Létrehoz egy premium rendszer redeem kódot')
        .addStringOption(option =>
            option.setName('activation_key')
                .setDescription('A redeem kód aktiváláshoz szükséges')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duration_in_days')
                .setDescription('Az időtartam, amennyi időt ad a premiumhoz (napokban)')
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
        const durationInDays = interaction.options.getInteger('duration_in_days');
        const premiumlogo = process.env.premiumlogo;
        const premiumemoji = process.env.premium;
        const userpremiumcodes = '1189634733324390462';

        try {
            // Ellenőrzi, hogy a kód már létezik-e
            const existingCode = await PremiumCodeGuild.findOne({ activationKey });
            if (existingCode) {
                return interaction.reply('Ez a redeem kód már létezik. Kérlek válass egy másikat.');
            }

            // Létrehozza a redeem kódot az adatbázisban
            const newCode = new PremiumCodeGuild({
                activationKey,
                durationInDays,
                createdBy: interaction.user.id, // Az aktuális felhasználó azonosítója (discordId)
            });

            await newCode.save();

            // Visszajelzés küldése
            
            const embed = new EmbedBuilder()
                .setColor(0x82272a) // Zöld szín
                .setTitle(`${premiumemoji} Premium rendszer redeem kód létrehozva.`)
                .addFields([
                    { name: '\`🔑\`' + ' Aktivációs kulcs', value: "```" + `${activationKey}` + "```", inline: true },
                    { name: '\`⏰\`' + ' Idő', value: "`" + `${durationInDays} nap` + "`", inline: true },
                    { name: '\`💫\`' + ' Kategória', value: "`" + `Szerverek számára` + "`", inline: true },
                ])
                .setThumbnail(`${premiumlogo}`);

            interaction.reply({ embeds: [embed] });


        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a kód létrehozása során.');
        }

        try {
            const UPCChannelSend = client.channels.cache.get(userpremiumcodes);

            if (UPCChannelSend) {
                const embed1 = new EmbedBuilder()
                .setColor(0x82272a) // Zöld szín
                .setTitle(`${premiumemoji} Premium rendszer redeem kód létrehozva.`)
                .addFields([
                    { name: '\`🔑\`' + ' Aktivációs kulcs', value: "```" + `${activationKey}` + "```", inline: true },
                    { name: '\`⏰\`' + ' Idő', value: "`" + `${durationInDays} nap` + "`", inline: true },
                    { name: '\`💫\`' + ' Kategória', value: "`" + `Felhasználók számára` + "`", inline: true },
                ])
                .setThumbnail(`${premiumlogo}`);

                await UPCChannelSend.send({ embeds: [embed1] });
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a Premium Code elküldése során.');
        }

    },
};
