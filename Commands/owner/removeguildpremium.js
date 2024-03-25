const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../Models/PremiumGuild');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeguildpremium')
        .setDescription('Egy adott szerver preumjának törlése')
        .addStringOption(option => option
            .setName('guild')
            .setDescription('Szerver ID')
            .setRequired(true)
        ),
    async execute(interaction) {
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
        const guildId = interaction.options.getString('guild');

        try {
            // Check if the server has an active premium system
            const targetDbGuild = await Guild.findOne({ guildId });

            if (targetDbGuild) {
                if (targetDbGuild.premium.isEnabled) {
                    // Remove premium from the target server
                    targetDbGuild.premium = {
                        isEnabled: false,
                        expirationDate: null,
                    };

                    await targetDbGuild.save();

                    interaction.reply(`A premium törölve lett a kért szerverről: \`${guildId}\`.`);
                } else {
                    interaction.reply(`Ennek a szervrnek, \`${guildId}\` nincs premiumja.`);
                }
            } else {
                interaction.reply(`Enneka szervernek, \`${guildId}\` nem volt még premiumja.`);
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt.');
        }
    },
};
