const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { User } = require('../../Models/economy');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toplista')
        .setDescription('Toplistát mutat az 5 leggazdagabb emberről.'),
    async execute(interaction, client) {
        await interaction.deferReply();

        const users = await User.find().then(users => {
            return users.filter(async user => await interaction.guild.members.fetch(user.is));
        });

        const sortedUsers = users.sort((a, b) => {
            return b.wallet + b.bank - (a.wallet + a.bank);
        }).slice(0, 5);

        try {
            const topEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `🏆 TOP 5 leggazdagabb ember`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor(0xffae00)
                .setThumbnail(process.env.top5logo)
                .setDescription(sortedUsers.map((user, index) => {
                    return `**[${index + 1}]** : <@${user.id}> : \`${user.wallet + user.bank}\` ${process.env.darycoin}`;
                }).join('\n'));

            return interaction.editReply({ embeds: [topEmbed] });
        } catch (error) {
            console.log(error);
        }
    }
};
