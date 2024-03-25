const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { User } = require('../../Models/economy');
const { Targy } = require('../../Models/economyitem');
const { Taska } = require('../../Models/economybackpack');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bolt')
        .setDescription('Bolt megtekintése és vásárlás.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('megtekintes')
                .setDescription('Megjeleníti a bolt kínálatát.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('vasarlas')
                .setDescription('Vásárlás a boltból.')
                .addStringOption(option =>
                    option
                        .setName('targy')
                        .setDescription('Vásárolni kívánt tárgy neve.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option
                        .setName('mennyiseg')
                        .setDescription('Mennyiség, amennyit vásárolni szeretnél.')
                        .setMinValue(1)
                        .setMaxValue(5)
                )
        ),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'megtekintes') {
            // Megjelenítjük a bolt kínálatát
            const targyak = await Targy.find({ aktív: true }); // Csak az aktív tárgyakat jelenítsük meg
            const boltEmbed = new EmbedBuilder()
                .setTitle('Bolt Kínálata')
                .setThumbnail(process.env.shoplogo)
                .setImage(process.env.bolttext)
                .setDescription('Vásárolhatsz különböző tárgyakat itt.')
                .setColor(0xffae00);

            for (const targy of targyak) {
                let fieldDescription = `Ár: \`${targy.ar}\` ${process.env.darycoin}`;

                // Mennyiség, lejárati idő és rang ellenőrzése és hozzáadása a leíráshoz
                if (targy.mennyiseg) {
                    const maradekMennyiseg = targy.mennyiseg - (targy.vetel || 0);
                    fieldDescription += `\nMennyiség: \`${maradekMennyiseg}/${targy.mennyiseg}\``;
                }

                if (targy.lejaratIdo) {
                    fieldDescription += `\nLejár: ${targy.lejaratIdo.toISOString()}`;
                }

                if (targy.rang) {
                    fieldDescription += `\nRang: ${targy.rang}`;
                }

                boltEmbed.addFields(
                    { name: `${targy.nev}`, value: fieldDescription, inline: true }
                );
            }

            return interaction.reply({
                embeds: [boltEmbed],
            });
        } else if (subcommand === 'vasarlas') {
            // Vásárlás a boltból
            const targyNeve = interaction.options.getString('targy');
            const mennyiseg = interaction.options.getNumber('mennyiseg') || 1; // Alapértelmezett érték: 1
            const user = interaction.user;

            const targy = await Targy.findOne({ nev: targyNeve });

            if (!targy) {
                return interaction.reply('Nincs ilyen tárgy a boltban.');
            }

            // Ellenőrizze, van-e elég pénz a felhasználónál a vásárláshoz
            const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

            if (userData.wallet < targy.ar * mennyiseg) {
                return interaction.reply('Nincs elég pénzed a vásárláshoz.');
            }

            // Ellenőrizze, hogy van-e még elegendő mennyiség a tárgyból
            if (targy.mennyiseg && (targy.vetel || 0) + mennyiseg > targy.mennyiseg) {
                return interaction.reply('Elfogyott az összes készlet ennek a tárgynak.');
            }

            // Implementáld a vásárlás logikáját és a tárgyak hozzáadását a felhasználóhoz
            // Példa: Hozzáadni a felhasználó taskájához a megvásárolt tárgyat
            const taska = await Taska.findOne({ userId: user.id }) || new Taska({ userId: user.id });

            // Ellenőrizze, hogy a tárgy már van-e a felhasználó táskájában
            const existingItem = taska.targyak.find(item => item.targyId.toString() === targy._id.toString());

            if (existingItem) {
                // Ha már van ilyen tárgy, csak növeld meg a mennyiséget
                existingItem.mennyiseg += mennyiseg;
            } else {
                // Ha nincs ilyen tárgy, hozzáadjuk a táskához
                taska.targyak.push({ targyId: targy._id, mennyiseg: mennyiseg });
            }

            // Csökkentsd a felhasználó pénzét a vásárlás után
            userData.wallet -= targy.ar * mennyiseg;

            // Megvásárolt mennyiség hozzáadása a tárgyhoz
            targy.vetel = (targy.vetel || 0) + mennyiseg;

            // Mentés a változtatásokhoz az adatbázisban
            await userData.save();
            await taska.save();
            await targy.save();

            const vasarlasEmbed = new EmbedBuilder()
                .setTitle('Vásárlás Sikeres')
                .setDescription(`Sikeresen vásároltad a(z) ${mennyiseg} ${targy.nev} tárgyat!`)
                .setColor(0x00ff00);

            return interaction.reply({
                embeds: [vasarlasEmbed],
            });
        }
    },
};
