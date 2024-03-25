const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { User } = require('../../Models/economy');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pay.')
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
        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        let userData = await User.findOne({ id: user.id });
        if (!userData) {
            userData = new User({ id: user.id });
        }

        const toleUser = interaction.user;
        let toleUserData = await User.findOne({ id: toleUser.id });
        if (!toleUserData) {
            toleUserData = new User({ id: toleUser.id });
        }

        const amount = interaction.options.getNumber('amount');

        if (toleUserData.bank < amount) {
            return interaction.followUp({
                embeds: [new EmbedBuilder().setDescription('💰 Nincs elég egyenleged a bankban.').setColor(0xff0000)],
                ephemeral: true,
            });
        }

        toleUserData.bank -= amount;
        userData.bank += amount;
        userData.save();
        toleUserData.save();

        const addmoneyEmbed = new EmbedBuilder()
            .setTitle(`${user.username} Egyenlege ${process.env.darycoin}`)
            .setDescription('A kézpénz és a bank egyenleget látod.')
            .setColor(0xffae00)
            .setThumbnail(toleUser.displayAvatarURL())
            .addFields(
                { name: 'Ő küldött coint', value: `**\`${toleUser.username}\`**`, inline: true },
                { name: 'Neki küldött coint', value: `**\`${user.username}\`**`, inline: true },
                { name: 'Ennyit coint küldött', value: `**\`${amount}\` ${process.env.darycoin}**`, inline: true },
            );

        return interaction.followUp({
            embeds: [addmoneyEmbed],
        });
    },
};
