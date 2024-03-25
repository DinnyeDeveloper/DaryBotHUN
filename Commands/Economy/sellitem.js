const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { User } = require('../../Models/economy');
const { Taska } = require('../../Models/economybackpack');
const { Targy } = require('../../Models/economyitem');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eladas')
        .setDescription('Tárgy eladása a boltba.')
        .addStringOption(option =>
            option
                .setName('targy')
                .setDescription('Eladni kívánt tárgy neve.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('mennyiseg')
                .setDescription('Mennyiség, amennyit eladni szeretnél.')
                .setMinValue(1)
        ),
    async execute(interaction, client) {
        const targyNev = interaction.options.getString('targy');
        const mennyiseg = interaction.options.getNumber('mennyiseg') || 1; // Alapértelmezett érték: 1
        const user = interaction.user;

        const targy = await Targy.findOne({ nev: targyNev });

        if (!targy) {
            return interaction.reply('Nincs ilyen tárgy a boltban.');
        }

        // Ellenőrizze, van-e elég mennyiség a tárgyból a felhasználó táskájában
        const taska = await Taska.findOne({ userId: user.id });

        if (!taska) {
            return interaction.reply('Nincs ilyen tárgy a táskádban.');
        }

        const existingItem = taska.targyak.find(item => item.targyId.toString() === targy._id.toString());

        if (!existingItem || existingItem.mennyiseg < mennyiseg) {
            return interaction.reply(`Nincs elég ${targyNev} a táskádban.`);
        }

        // Kérdezzük meg a felhasználót, hogy biztosan el akarja-e adni
        const confirmEmbed = new EmbedBuilder()
            .setTitle('Eladás megerősítése')
            .setDescription(`Biztosan el akarod adni a(z) ${mennyiseg} ${targyNev} tárgyat?`)
            .setColor(0xffae00);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('eladas_megerosites')
                    .setLabel('Megerősítés')
                    .setStyle('Primary'),
                new ButtonBuilder()
                    .setCustomId('eladas_megse')
                    .setLabel('Mégse')
                    .setStyle('Danger')
            );

        await interaction.reply({
            embeds: [confirmEmbed],
            components: [row],
        });

        const filter = i => i.customId === 'eladas_megerosites' || i.customId === 'eladas_megse';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'eladas_megerosites') {
                // Implementáld az eladás logikáját és a tárgyak eltávolítását a felhasználó táskájából
                existingItem.mennyiseg -= mennyiseg;

                // Implementáld a felhasználó pénzének növelését a vásárlás után
                const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });
                const eladasiAr = Math.floor(targy.ar / 2); // Csak a bolti ár feléért lehet eladni
                const osszeg = eladasiAr * mennyiseg;

                userData.wallet += osszeg;

                // Mentés a változtatásokhoz az adatbázisban
                await taska.save();
                await userData.save();

                const eladasEmbed = new EmbedBuilder()
                    .setTitle('Eladás Sikeres')
                    .setDescription(`Sikeresen eladtad a(z) ${mennyiseg} ${targyNev} tárgyat!\nKaptál érte ${osszeg} ${process.env.darycoin}.`)
                    .setColor(0x00ff00);

                interaction.followUp({
                    embeds: [eladasEmbed],
                });
            } else {
                // Mégse gomb esetén válaszoljunk, hogy az eladás megszakadt
                interaction.followUp('Az eladás megszakadt.');
            }

            // Szükség esetén inaktiváljuk a gombokat, hogy ne lehessen újra rájuk kattintani
            row.components.forEach(component => component.setDisabled(true));
            interaction.editReply({
                components: [row],
            });
        });

        collector.on('end', collected => {
            // Szükség esetén, ha a collector időkorlátos, itt kezelhetjük az eseményeket
            console.log(`A collector befejeződött. Gyűjtött üzenetek száma: ${collected.size}`);
        });
    },
};
