const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listlogs')
    .setDescription('Kilistázza az elérhető log fájlokat'),

  async execute(interaction) {
    const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
    const logDirectory = './log'; // A log mappa elérési útja
    const logFiles = fs.readdirSync(logDirectory);

    if (logFiles.length === 0) {
      return interaction.reply('Nincs elérhető log fájl a megadott mappában.');
    }

    const logFileNames = logFiles.map((file) => path.parse(file).name); // Az ".txt" kiterjesztés nélküli file nevek

    const totalLogs = logFiles.length;

    const embed = {
      title: 'Elérhető log fájlok:',
      description: logFileNames.join('\n'),
      color: 0x00ff00, // Zöld szín (hexa formátumban)
      footer: {
        text: `Összesen ${totalLogs} log fájl`,
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
