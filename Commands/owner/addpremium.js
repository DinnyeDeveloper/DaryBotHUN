const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { connect } = require('mongoose');
const User = require("../../Models/Premium");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpremium')
        .setDescription('Premiumot tudsz adni egy felhasználóra.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Felhasználó')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('duration')
            .setDescription('Add meg az időt számmal. A szám napokban értendő.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
        const premiumlogo = process.env.premiumlogo;
        const premiumemoji = process.env.premium;




    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');

        if (duration <= 0) {
            return interaction.reply('Az időtartalomnak pozitív számnak kell lennie.');
        }

        try {
            let existingUser = await User.findOne({ discordId: user.id });

            if (!existingUser) {
                // Ha a felhasználó még nem létezik, létrehozzuk az új felhasználót
                existingUser = new User({
                    discordId: user.id,
                    username: user.username,
                    premium: {
                        isEnabled: false,
                        expirationDate: null,
                    },
                });
            }

            // Beállítjuk a premium rendszert az adott időtartamra
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + duration);

            existingUser.premium = {
                isEnabled: true,
                expirationDate: expirationDate,
            };

            await existingUser.save();


            const memberpremiumembed = new EmbedBuilder()
                .setTitle(`${premiumemoji} **Sikeresen hozzáadva.**`)
                .setThumbnail(`${premiumlogo}`)
                .setDescription(`Sikeresen adtál premiumot a(z) megadott felhasználónak.`)
                .setColor(0x82272a)
                .addFields(
                    { name: `\`🔎\` **Felhasználó**`, value: `<@${user.id}>`, inline: true },
                    { name: `\`🔎\` **Idő**`, value: `\`${duration}\` nap`, inline: true },
                )



            return interaction.reply( {embeds: [memberpremiumembed]} );
        } catch (error) {
            console.error(error);
            return interaction.reply('Hiba történt a prémium hozzáadása közben.');
        }
    },
};
