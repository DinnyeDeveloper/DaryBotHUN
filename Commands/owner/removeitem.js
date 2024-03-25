const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Targy } = require('../../Models/economyitem');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('targytorles')
        .setDescription('Tárgy törlése a boltból.')
        .addStringOption(option =>
            option
                .setName('targynev')
                .setDescription('A törölni kívánt tárgy neve.')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
        const targyNev = interaction.options.getString('targynev');

        // Ellenőrizzük, hogy létezik-e a tárgy
        const targy = await Targy.findOne({ nev: targyNev });

        if (!targy) {
            const notFoundEmbed = new EmbedBuilder()
                .setTitle('Hiba')
                .setDescription(`Nincs ilyen nevű tárgy a boltban: ${targyNev}.`)
                .setColor(0xff0000);

            return interaction.reply({
                embeds: [notFoundEmbed],
            });
        }

        // Ne törölje véglegesen, csak állítsa be inaktívvá
        targy.aktív = false;
        await targy.save();

        const responseEmbed = new EmbedBuilder()
            .setTitle('Tárgy Inaktívvá Téve')
            .setDescription(`A(z) ${targyNev} tárgy sikeresen inaktívvá téve a boltban.`)
            .setColor(0x00ff00);

        return interaction.reply({
            embeds: [responseEmbed],
        });
    },
};
