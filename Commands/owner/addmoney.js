const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { User } = require('../../Models/economy');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmoney')
        .setDescription('Saját, vagy más egyenlegének megtekintése.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Adj meg egy felhasználót.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('amount')
                .setDescription('Add meg a feltölteni kívánt összeget.')
                .setRequired(true)
                .setMinValue(100)
                .setMaxValue(999999999)
        ),
    async execute(interaction) {
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        let userData = await User.findOne({ id: user.id });

        if (!userData) {
            userData = new User({ id: user.id });
        }

        const amount = interaction.options.getNumber('amount');

        userData.wallet += amount;
        userData.save();

        const addmoneyEmbed = new EmbedBuilder()
            .setTitle(`${user.username} Egyenlege ${process.env.darycoin}`)
            .setDescription('A kézpénz és a bank egyenleget látod.')
            .setColor(0xffae00)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'Hozzáadott coin mennyiség', value: `**\`${amount}\` ${process.env.darycoin}**`, inline: true },
                { name: 'Mostani egyenleg:', value: `**\`${userData.wallet}\` ${process.env.darycoin}**`, inline: true },
            );

        return interaction.followUp({
            embeds: [addmoneyEmbed],
        });
    },
};
