const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaveguild')
    .setDescription('Kilép a megadott szerverről')
    .addStringOption(option =>
      option
        .setName('server_id')
        .setDescription('A célszerver azonosítója')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const serverId = interaction.options.getString('server_id');

    const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }

    try {
      const leaveserverChannel = '1163372561413984276'; // Cseréld le a csatorna azonosítójára

      const leaveserverChannelSend = client.channels.cache.get(leaveserverChannel);
      const guild = await interaction.client.guilds.fetch(serverId);
      await guild.leave();
      await leaveserverChannelSend.send(`Sikeresen kiléptem a(z) "${guild.name}" szerverről.`);
    } catch (error) {
      await interaction.reply('Hiba történt a szerverről való kilépés közben.');
      console.error(error);
    }
  },
};
