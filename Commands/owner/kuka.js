const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Targy } = require('../../Models/economyitem');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('targykuka')
        .setDescription('Inaktív (törölt) tárgyak listázása a boltból.')
        .addBooleanOption(option =>
            option
                .setName('minden')
                .setDescription('Az összes tárgy megjelenítése, beleértve az aktívakat is.')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
        const minden = interaction.options.getBoolean('minden');

        // Ellenőrizze, hogy az aktív vagy az összes tárgyat kell-e megjeleníteni
        const targyak = minden
            ? await Targy.find()
            : await Targy.find({ aktív: false });

        if (targyak.length === 0) {
            return interaction.reply('Nincsenek inaktív (törölt) tárgyak.');
        }

        const kukaEmbed = new EmbedBuilder()
            .setTitle('Tárgy Kuka')
            .setDescription('Inaktív (törölt) tárgyak a boltból.')
            .setColor(0xff0000);

        for (const targy of targyak) {
            const statusText = targy.aktív ? 'Aktív 🟢' : 'Inaktív 🔴';

            kukaEmbed.addFields(
                { name: `\`🎈\` ${targy.nev}`, value: `\`💵\` Ár: \`${targy.ar}\` ${process.env.darycoin} \n\`🔎\` Státusz: \`${statusText}\``, inline: true }
            );
        }

        return interaction.reply({
            embeds: [kukaEmbed],
        });
    },
};
