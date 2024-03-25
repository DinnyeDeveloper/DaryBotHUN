const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Ad = require('../../Models/Ad'); // importáljuk az Ad modellt
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hirdetesek')
        .setDescription('Itt láthatod az összes hirdetést a LilyBot rendszerből.'),

    async execute(interaction, client) {
        try {
            const ads = await Ad.find({}, null, { limit: 10, sort: { createdAt: -1 } }); // legfeljebb 10 hirdetés lekérése, időrendi sorrendben

            if (ads.length > 0) {
                const chunkedAds = chunkArray(ads, 5); // Hirdetések csoportosítása 5-ös csoportokba

                const initialEmbed = createAdEmbed(chunkedAds[0], 1, chunkedAds.length, client);
                const initialButtons = createButtons(1, chunkedAds.length);

                const reply = await interaction.reply({
                    embeds: [initialEmbed],
                    components: [initialButtons],
                });

                const collector = interaction.channel.createMessageComponentCollector({
                    filter: (i) => i.isButton(),
                    time: 60000, // Timeout after 1 minute
                });

                let currentPage = 0;

                collector.on('collect', async (buttonInteraction) => {
                    await buttonInteraction.deferUpdate();

                    if (buttonInteraction.customId === 'prevButton') {
                        currentPage = (currentPage - 1 + chunkedAds.length) % chunkedAds.length;
                    } else if (buttonInteraction.customId === 'nextButton') {
                        currentPage = (currentPage + 1) % chunkedAds.length;
                    }

                    const adEmbed = createAdEmbed(chunkedAds[currentPage], currentPage + 1, chunkedAds.length, client);
                    const buttons = createButtons(currentPage + 1, chunkedAds.length);

                    await reply.edit({
                        embeds: [adEmbed],
                        components: [buttons],
                    });
                });

                collector.on('end', () => {
                    const disabledButtons = createButtons(currentPage + 1, chunkedAds.length, true);
                    reply.edit({ components: [disabledButtons] });
                });
            } else {
                interaction.reply('Nincsenek elérhető hirdetések.');
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a hirdetések lekérése során.');
        }
    },
};

function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

// Módosított createAdEmbed függvény
function createAdEmbed(ads, currentPage, totalPages, client) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: `Hirdetések - Oldal ${currentPage}/${totalPages}`, iconURL: client.user.displayAvatarURL({ size: 1024 }) })
        .setTimestamp()
        .setColor(0x82272a)
        .setFooter({ text: 'Hirdetések', iconURL: client.user.displayAvatarURL() });

    ads.forEach((ad, index) => {
        const title = ad.title.replace(/:/g, '').replace(/_/g, ''); // Az id-ből generált title kezelése
        const name = `#${index + 1} ${title}`;
        const lekerdezesiid = `${ad.id}`;
        
        // Új rész a szerző (author) hozzáadásához
        const authorName = ad.author || 'Nemtudom';
        const authorDisplayName = client.users.cache.get(authorName) ? client.users.cache.get(authorName).tag : authorName;

        embed.addFields(
            { name: name, value: `\`✍\` ID: ${lekerdezesiid}\n\`✍\` Írta: ${authorDisplayName}\n\`📆\` Publikálás ideje: ${new Date(ad.createdAt).toLocaleString()}\n[︲Meghívó Link︲](${ad.inviteLink})\n━━━━━━━━━━━━━━` },
        );
    });

    return embed;
}


function createButtons(currentPage, totalPages, disabled = false) {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevButton')
                .setLabel('◀')
                .setStyle('Primary')
                .setDisabled(disabled || currentPage === 1),
            new ButtonBuilder()
                .setCustomId('nextButton')
                .setLabel('▶')
                .setStyle('Primary')
                .setDisabled(disabled || currentPage === totalPages)
        );

    return row;
}
