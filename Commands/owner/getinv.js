const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinvite')
    .setDescription('Küldd el a megadott szerver meghívóját privátban')
    .addStringOption(option =>
      option
        .setName('server_id')
        .setDescription('A célszerver azonosítója')
        .setRequired(true)
    ),
  async execute(interaction) {
    const serverId = interaction.options.getString('server_id');

    const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }

    try {
      const guild = await interaction.client.guilds.fetch(serverId);
      const invites = await guild.invites.fetch();

      if (invites.size > 0) {
        const invite = invites.first();
        await interaction.user.send(`Itt a meghívó a(z) "${guild.name}" szerverhez: ${invite.url}`);
        await interaction.reply('A szerver meghívója elküldve privátban.');
      } else {
        await interaction.reply('Ehhez a szerverhez nincs elérhető meghívó.');
      }
    } catch (error) {
      await interaction.reply('Hiba történt a meghívó lekérése közben.');
      console.error(error);
    }
  },
};
