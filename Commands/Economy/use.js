const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Taska } = require('../../Models/economybackpack');
const { Targy } = require('../../Models/economyitem');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hasznal')
        .setDescription('Tárgy törlése a saját táskádból.')
        .addStringOption(option =>
            option
                .setName('targynev')
                .setDescription('A törölni kívánt tárgy neve.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('mennyiseg')
                .setDescription('A törölni kívánt tárgy mennyisége.')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const user = interaction.user;
        const targyNev = interaction.options.getString('targynev');
        const mennyiseg = interaction.options.getInteger('mennyiseg');

        // Ellenőrizzük, hogy a felhasználónak van-e ilyen nevű tárgya és van-e elegendő mennyiség
        const taska = await Taska.findOne({ userId: user.id });
        if (!taska) {
            const noInventoryEmbed = new EmbedBuilder()
                .setTitle('Hiba')
                .setDescription('A táskád üres.')
                .setColor(0xff0000);

            return interaction.reply({
                embeds: [noInventoryEmbed],
            });
        }

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

        const targyIndex = taska.targyak.findIndex(item => item.targyId.equals(targy._id));
        if (targyIndex === -1 || taska.targyak[targyIndex].mennyiseg < mennyiseg) {
            const notEnoughItemsEmbed = new EmbedBuilder()
                .setTitle('Hiba')
                .setDescription(`Nincs elég ${targyNev} a táskádban.`)
                .setColor(0xff0000);

            return interaction.reply({
                embeds: [notEnoughItemsEmbed],
            });
        }

        // Csökkentjük a tárgy mennyiségét a táskában
        taska.targyak[targyIndex].mennyiseg -= mennyiseg;
        await taska.save();

        const responseEmbed = new EmbedBuilder()
            .setTitle('Tárgy elhasználva.')
            .setThumbnail(process.env.uselogo)
            .setImage(process.env.usetext)
            .setDescription(`Sikeresen elhasználtál \`${mennyiseg} db\` \`${targyNev}\`-t.`)
            .setColor(0x00ff00);

        return interaction.reply({
            embeds: [responseEmbed],
        });
    },
};
