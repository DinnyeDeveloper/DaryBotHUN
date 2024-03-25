const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { User } = require('../../Models/economy');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rablás')
        .setDescription('rablás.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Adj meg egy felhasználót.')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const tolelopottuser = interaction.options.getUser('user');
        let tolelopottuserData = await User.findOne({ id: tolelopottuser.id });
        if (!tolelopottuserData) {
            tolelopottuserData = new User({ id: tolelopottuser.id });
        }

        const rablouser = interaction.user;
        let rablouserData = await User.findOne({ id: rablouser.id });
        if (!rablouserData) {
            rablouserData = new User({ id: rablouser.id });
        }

        const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10;

        if (tolelopottuserData.wallet < amount) {
            tolelopottuserData.wallet = 0;
            rablouserData.wallet += tolelopottuserData.wallet;

            tolelopottuserData.save();
            rablouserData.save();
            return interaction.followUp({
                embeds: [new EmbedBuilder().setDescription('💰 Nem volt nála elég pénz. Ezért mindent el loptál tőle.').setColor(0xff0000)],
                ephemeral: true,
            });
        }

        tolelopottuserData.wallet -= amount;
        rablouserData.wallet += amount;

        tolelopottuserData.save();
        rablouserData.save();
        return interaction.followUp({
            embeds: [new EmbedBuilder().setDescription(`💰 Ennyit sikerült lopni tőle. ${amount}`).setColor(0xff0000)],
            ephemeral: true,
        });


    },
};
