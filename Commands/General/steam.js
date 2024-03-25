const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const request = require('node-superfetch');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steam')
        .setDescription('Kereshetsz Steam-en játékokról infokat!')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('A Steam-es játék neve.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const query = interaction.options.getString('game');
        if (query === 'ENA') return interaction.reply({ content: 'Command Usage: `/steam <Game>`', ephemeral: true });

        const search = await request
            .get('https://store.steampowered.com/api/storesearch')
            .query({
                cc: 'us',
                l: 'en',
                term: query
            });

        if (!search.body.items.length) return interaction.reply({ content: `No search results found for **${query}**!`, ephemeral: true });

        const { id, tiny_image } = search.body.items[0];
        const { body } = await request
            .get('https://store.steampowered.com/api/appdetails')
            .query({ appids: id });

        const { data } = body[id.toString()];
        const current = data.price_overview ? `$${data.price_overview.final / 100}` : 'Ingyenes';
        const original = data.price_overview ? `$${data.price_overview.initial / 100}` : 'Ingyenes';
        const price = current === original ? current : `~~${original}~~ ${current}`;
        const platforms = [];

        if (data.platforms) {
            if (data.platforms.windows) platforms.push(`${process.env.Windows}`);
            if (data.platforms.mac) platforms.push(`${process.env.Mac}`);
            if (data.platforms.linux) platforms.push(`${process.env.Linux}`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`__**${data.name}**__`)
            .setThumbnail(process.env.steamLogo)
            /*.setURL(`http://store.steampowered.com/app/${data.steam_appid}`)*/
            .addFields(
                { name: '\`💵\`' + ' ÁR', value: `${price}`, inline: true },
                { name: '\`🏅\`' + ' Meta pontszám', value: `${data.metacritic ? data.metacritic.score : `\`Nincs Adat\``}`, inline: true },
                { name: '\`🤟\`' + ' Ajánlások', value: `${data.recommendations ? data.recommendations.total : `\`Nincs Adat\``}`, inline: true },
                { name: '\`💻\`' + ' Felület', value: `${platforms.join('︲') || 'Nincs'}`, inline: true },
                { name: '\`📅\`' + ' Megjelenése', value: `${data.release_date ? data.release_date.date : `\`Nincs Adat\``}`, inline: true },
                { name: '\`🎨\`' + ' DLC Szám', value: `${data.dlc ? data.dlc.length : 0}`, inline: true },
                { name: '\`🗿\`' + ' Fejlesztő', value: `${data.developers ? data.developers.join(', ') || `\`Nincs Adat\`` : `\`Nincs Adat\``}`, inline: true },
                { name: '\`🚀\`' + ' Kiadó', value: `${data.publishers ? data.publishers.join(', ') || `\`Nincs Adat\`` : `\`Nincs Adat\``}`, inline: true },
            )
            .setColor('#33FFAF')
            .setImage(tiny_image);

            // Hozz létre egy interaktív sor objektumot (ActionRow)
        const row = new ActionRowBuilder()
        .addComponents(
            // Hozz létre egy LINK típusú gombot
            new ButtonBuilder()
                .setLabel(`${data.name} megtekintése steam-en`)
                .setStyle('Link')
                .setURL(`http://store.steampowered.com/app/${data.steam_appid}`),
                new ButtonBuilder()
                    .setLabel('Küld el DM')
                    .setStyle('Primary')
                    .setCustomId('send_private_embed')
        );

        const privaterow = new ActionRowBuilder()
        .addComponents(
            // Hozz létre egy LINK típusú gombot
            new ButtonBuilder()
                .setLabel(`${data.name} megtekintése steam-en`)
                .setStyle('Link')
                .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
        );

        // Küldd el az embedet és a gombokat
        await interaction.reply({ embeds: [embed], components: [row] });

        // Várj egy gomb interakcióra
        const filter = i => i.customId === 'send_private_embed' || i.customId === 'lejart_gomb' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 }); // A 60 másodperc csak egy példa, beállíthatod másra

        collector.on('collect', async i => {
            // Küldd el a privát üzenetet az embeddel
            await i.reply({ content: '>>> Elküldtem privátban!', ephemeral: true });
            await interaction.user.send({ embeds: [embed], components: [privaterow] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                // Ha nem történt gombnyomás a megadott idő alatt
                row.components[1] = new ButtonBuilder()
                    .setLabel('Küld el DM')
                    .setStyle('Primary')
                    .setDisabled(true)
                    .setCustomId('lejart_gomb');
                interaction.editReply({ components: [row] });
            }
        });
    },
};