const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { connect } = require('mongoose');
const Guild = require("../../Models/PremiumGuild");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpremiumguild')
        .setDescription('Premiumot tudsz adni egy szerverre.')
        .addStringOption(option => option
            .setName('guild')
            .setDescription('Szerver ID')
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
        const guildId = interaction.options.getString('guild');
        const duration = interaction.options.getInteger('duration');

        if (duration <= 0) {
            return interaction.reply('Az időtartalomnak pozitív számnak kell lennie.');
        }

        try {
            let existingGuild = await Guild.findOne({ guildId });

            if (!existingGuild) {
                // Ha a szerver még nem létezik, létrehozzuk az új szerver bejegyzést
                existingGuild = new Guild({
                    guildId: guildId,
                    premium: {
                        isEnabled: false,
                        expirationDate: null,
                    },
                });
            }

            // Beállítjuk a premium rendszert az adott időtartamra
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + duration);

            existingGuild.premium = {
                isEnabled: true,
                expirationDate: expirationDate,
            };

            await existingGuild.save();

            const guildpremiumembed = new EmbedBuilder()
                .setTitle(`${premiumemoji} **Sikeresen hozzáadva.**`)
                .setThumbnail(`${premiumlogo}`)
                .setDescription(`Sikeresen adtál premiumot a(z) megadott szervernek.`)
                .setColor(0x82272a)
                .addFields(
                    { name: `\`🔎\` **Szerver ID**`, value: `\`${guildId}\``, inline: true },
                    { name: `\`🔎\` **Idő**`, value: `\`${duration}\` nap`, inline: true },
                )

            return interaction.reply( {embeds: [guildpremiumembed]} );
        } catch (error) {
            console.error(error);
            return interaction.reply('Hiba történt a prémium hozzáadása közben.');
        }
    },
};
