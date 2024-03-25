const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const QuickChart = require('quickchart-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tag-számláló')
        .setDescription('Megnézi és statisztikát csinál a szerveren lévő tagokból.'),
    async execute(interaction, client) {
        const guild = interaction.guild;
        const totalMembers = guild.memberCount;
        const botMembers = guild.members.cache.filter(member => member.user.bot).size;
        const humanMembers = totalMembers - botMembers;
        const last24Hours = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 24 * 60 * 60 * 1000).size;
        const last7Days = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 7 * 24 * 60 * 60 * 1000).size;
       


        const chart = new QuickChart();
        chart
            .setConfig({
                type: 'bar',
                data: {
                    labels: ['Összesen', 'Emberek', 'Botok', '24 óra', '7 nap'],
                    datasets: [{
                        label: 'Tagok száma',
                        data: [totalMembers, humanMembers, botMembers, last24Hours, last7Days],
                        backgroundColor: ['#36a2eb', '#ffce56', '#ff6384', '#cc65fe', '#66ff99']
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Članovi servera ${guild.name}`
                        }
                    }
                },



            
            })

            .setWidth(500)
            .setHeight(300)
            .setBackgroundColor('#151515');
           


        const chartUrl = await chart.getShortUrl();

        const embed = new EmbedBuilder()

            .setTitle(`📙︲Tagok száma`)
            .setColor('#82272a')
            .setFooter({ text: `LilyBot`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`\`🔎\` Összesen: **${totalMembers}**\n\`👤\` Emberek: **${humanMembers}**\n\`🤖\` Botok: **${botMembers}**\n\`⏰\` Elmúlt 24 óra: **${last24Hours}**\n\`📅\` Elmúlt 7 nap: **${last7Days}**`)
            .setImage(chartUrl);

        interaction.reply({ embeds: [embed] });
    },
};