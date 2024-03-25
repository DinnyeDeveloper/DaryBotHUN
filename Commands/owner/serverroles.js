const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sroles')
        .setDescription('Megmutatja a szerver rangjait.'),
    async execute(interaction) {
        const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
        let rolesdisplay;
        if (roles.length < 70) {
            rolesdisplay = roles.join(" ");
        } else {
            rolesdisplay = roles.slice(70).join(" ");
        }

        const icon = interaction.guild.iconURL();

        const rolesEmbed = new EmbedBuilder()
            .setTitle('Szerver Rangok')
            .setThumbnail(icon)
            .setColor(0xffae00)
            .setFields(
                { name: `\`🤖\` **Rangok száma:**`, value: `[${roles.length}]`, inline: true },
                { name: `\`🤖\` **Rangok:**`, value: `[${roles}]`, inline: true },
            );

        await interaction.reply({ embeds: [rolesEmbed] });
    },
};
