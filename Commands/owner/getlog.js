const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getlog')
    .setDescription('Lekéri egy adott dátum és idő alapján a log fájlt.')
    .addStringOption((option) =>
      option
        .setName('datetime')
        .setDescription('A log fájl dátuma és időpontja (pl.: 2023-10-28-14-30-00)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }

    const logDirectory = './log'; // A log mappa elérési útja
    const logFiles = fs.readdirSync(logDirectory);
    const datetime = interaction.options.getString('datetime');

    if (!datetime) {
      await interaction.reply('Hiányzó vagy érvénytelen dátum és időpont.');
      return;
    }

    const logFileToRetrieve = logFiles.find((file) => file.startsWith(datetime));

    if (!logFileToRetrieve) {
      await interaction.reply('Nincs elérhető log fájl az adott dátum és időpont alapján.');
      return;
    }

    const logFilePath = path.join(logDirectory, logFileToRetrieve);
    const logFile = fs.readFileSync(logFilePath, 'utf-8');

    await interaction.reply({
      content: `Itt a kért log fájl (${datetime}):`,
      files: [{ attachment: Buffer.from(logFile), name: logFileToRetrieve }],
    });
  },
};
