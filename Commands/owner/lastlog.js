const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lastlog')
    .setDescription('Lekéri és elküldi az utolsó előtti log fájlt'),

  async execute(interaction) {
    const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
    const logDirectory = './log'; // A log mappa elérési útja
    const logFiles = fs.readdirSync(logDirectory);

    if (logFiles.length < 2) {
      return interaction.reply('Nincs elérhető log fájl az utolsó előtti fájlon kívül.');
    }

    // Rendezzük a log fájlokat időrendi sorrendben (a legfrissebbtől a legrégebbiig)
    logFiles.sort((a, b) => fs.statSync(path.join(logDirectory, b)).ctime - fs.statSync(path.join(logDirectory, a)).ctime);

    const secondLatestLogFile = logFiles[1];
    const logFilePath = path.join(logDirectory, secondLatestLogFile);

    const logFile = fs.readFileSync(logFilePath, 'utf-8');

    await interaction.reply({
      content: 'Itt az utolsó előtti log fájl:',
      files: [{ attachment: Buffer.from(logFile), name: secondLatestLogFile }],
    });
  },
};
