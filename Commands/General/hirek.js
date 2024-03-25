const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const NewsAPIKEY = '1572dd0c2b114dc9a064278bf5c52388'; // Get API KEY here: https://newsapi.org/
const NewsAPIEndpoint = 'https://newsapi.org/v2/top-headlines';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top10-hir')
        .setDescription('Get the latest news'),

    async execute(interaction, client) {
        const { member } = interaction;
        
        try {
            const response = await axios.get(NewsAPIEndpoint, {
                params: {
                    country: 'hu', // Hungary's country code
                    apiKey: NewsAPIKEY,
                },
            });

            if (response.data.articles && response.data.articles.length > 0) {
                const articles = response.data.articles.slice(0, 10); // Only top 10 articles
                const embed = new EmbedBuilder()
                    .setAuthor({ name: 'Top 10 Hírek Magyarországon', iconURL: client.user.displayAvatarURL({ size: 1024 }) })
                    .setTimestamp()
                    .setColor(0x82272a)
                    .setFooter({ text: 'News', iconURL: member.displayAvatarURL() });

                    const fields = articles.map((article, index) => ({
                        name: `#${index + 1} ${article.title}`,
                        value: `[︲Olvass tovább︲](${article.url})\n\`✍\` Írta: ${article.author || `\`Nemtudom\``}\n\`🌐\` Forrás: ${article.source.name}\n\`📆\`Publikálás ideje: ${new Date(article.publishedAt).toLocaleString()}\n━━━━━━━━━━━━━━`,
                    }));
                    
                    embed.addFields(fields);
                    

                await interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply('Nincsenek elérhető hírek.');
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a hírek lekérése során.');
        }
    },
};
