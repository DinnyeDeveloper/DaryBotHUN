const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const serversPerPage = 5;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servers')
    .setDescription('Kilistázza az összes szerver adatait')
    .addIntegerOption(option => option.setName('page').setDescription('Oldal szám')),
  async execute(interaction) {
    const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
    try {
      const client = interaction.client;
      const guilds = client.guilds.cache;

      if (guilds.size === 0) {
        await interaction.reply('A bot nincs jelen semelyik szerveren.');
        return;
      }

      const serverCount = guilds.size;
      const page = Math.floor((serverCount - 1) / serversPerPage);
      const pageIndex = interaction.options.getInteger('page') || 0;
      const startIdx = pageIndex * serversPerPage;
      const endIdx = Math.min((pageIndex + 1) * serversPerPage, serverCount);

      const embed = {
        color: 0x0099ff,
        title: 'Szerverek listája',
        fields: [],
      };

      const guildArray = Array.from(guilds.values()).slice(startIdx, endIdx);

      for (const guild of guildArray) {
        const field = {
          name: guild.name,
          value: `ID: ${guild.id}\nEmber szám: ${guild.memberCount}`,
        };

        embed.fields.push(field);
      }

      const totalServerText = `Összesen ${serverCount} szerveren van bent.`;

      await interaction.reply({
        embeds: [embed],
        components: [], // Üres gomb
        content: totalServerText,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply('Hiba történt a szerverek listázása közben.');
    }
  },
};
