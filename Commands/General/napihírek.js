const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const axios = require('axios');

const NewsAPIKEY = '1572dd0c2b114dc9a064278bf5c52388'; // Get API KEY here: https://newsapi.org/
const NewsAPIEndpoint = 'https://newsapi.org/v2/top-headlines';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('friss-hirek')
        .setDescription('Get the latest news'),

    async execute(interaction, client) {
        const { member } = interaction;

        try {
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

            const response = await axios.get(NewsAPIEndpoint, {
                params: {
                    country: 'hu', // Hungary's country code
                    apiKey: NewsAPIKEY,
                    pageSize: 10, // Requesting 10 articles
                    from: formattedDate,
                    to: formattedDate,
                },
            });

            if (response.data.articles && response.data.articles.length > 0) {
                const articles = response.data.articles;
                const chunkedArticles = chunkArray(articles, 5); // Chunking articles into arrays of 5

                const initialEmbed = createNewsEmbed(chunkedArticles[0], 1, chunkedArticles.length, client);
                const initialButtons = createButtons(1, chunkedArticles.length);

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
                        currentPage = (currentPage - 1 + chunkedArticles.length) % chunkedArticles.length;
                    } else if (buttonInteraction.customId === 'nextButton') {
                        currentPage = (currentPage + 1) % chunkedArticles.length;
                    }

                    const newsEmbed = createNewsEmbed(chunkedArticles[currentPage], currentPage + 1, chunkedArticles.length, client);
                    const buttons = createButtons(currentPage + 1, chunkedArticles.length);

                    await reply.edit({
                        embeds: [newsEmbed],
                        components: [buttons],
                    });
                });

                collector.on('end', () => {
                    const disabledButtons = createButtons(currentPage + 1, chunkedArticles.length, true);
                    reply.edit({ components: [disabledButtons] });
                });
            } else {
                interaction.reply('Nincsenek elérhető hírek.');
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a hírek lekérése során.');
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

function createNewsEmbed(articles, currentPage, totalPages, client) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: `Top Hírek Magyarországon - Oldal ${currentPage}/${totalPages}`, iconURL: client.user.displayAvatarURL({ size: 1024 }) })
        .setTimestamp()
        .setColor(0x82272a)
        .setFooter({ text: 'News', iconURL: client.user.displayAvatarURL() });

    const fields = articles.map((article, index) => ({
        name: `#${index + 1} ${article.title}`,
        value: `[︲Olvass tovább︲](${article.url})\n\`✍\` Írta: ${article.author || `\`Nemtudom\``}\n\`🌐\` Forrás: ${article.source.name}\n\`📆\`Publikálás ideje: ${new Date(article.publishedAt).toLocaleString()}\n━━━━━━━━━━━━━━`,
        inline: false,
    }));

    embed.addFields(fields);

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
