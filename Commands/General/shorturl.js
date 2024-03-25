const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const tinyurl = require('tinyurl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('url_rövidites')
        .setDescription('Lerövidíti az UTL-t.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Ide írd az URL-t.')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        tinyurl.shorten(url, function(res, err) {

            const Embed = new EmbedBuilder()
        .setColor(0x82272a)
        .addFields([
          { name: '\`💠\`' + ' URL', value: "```" + `${url}` + "```", inline: false },
          { name: '\`🌐\`' + ' Rövidített URL', value: "```" + `${res}` + "```", inline: false },
        ]);

            if (err)
                return interaction.reply({ content: `Error: ${err}`, ephemeral: true });
            interaction.reply({ embeds: [Embed], ephemeral: true });
        });
    },
};