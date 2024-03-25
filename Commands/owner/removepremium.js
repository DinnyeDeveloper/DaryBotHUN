const { SlashCommandBuilder } = require('discord.js');
const User = require('../../Models/Premium');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removepremium')
        .setDescription('Egy adott felhasználó premium törlése')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Felhasználó')
            .setRequired(true)
        ),
    async execute(interaction) {
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
        const targetUser = interaction.options.getUser('user');

        try {
            // Check if the target user has an active premium
            const targetDbUser = await User.findOne({ discordId: targetUser.id });

            if (targetDbUser) {
                if (targetDbUser.premium.isEnabled) {
                    // Remove premium from the target user
                    targetDbUser.premium = {
                        isEnabled: false,
                        expirationDate: null,
                    };

                    await targetDbUser.save();

                    interaction.reply(`A premium törölve lett tőle: ${targetUser.username}.`);
                } else {
                    interaction.reply(`${targetUser.username} nincs premiumja.`);
                }
            } else {
                interaction.reply('Soha nem volt premiumja.');
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt.');
        }
    },
};
