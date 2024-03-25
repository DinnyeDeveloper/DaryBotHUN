const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { User } = require("../../Models/economy")
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('egyenleg')
        .setDescription('Saját, vagy más egyenlegének megtekintése.')
        .addUserOption(
            option => option
            .setName("user")
            .setDescription("Tag")
        ),
    async execute(interaction, client) {
        const user = interaction.options.getUser("user") || interaction.member.user
        const userData = await User.findOne({ id: user.id}) || new User({ id: user.id })

        const balanceEmbed = new EmbedBuilder()
        .setTitle(`${user.username} Egyenlege ${process.env.darycoin}`)
        .setDescription("A kézpénz és a bank egyenleget látod.")
        .setColor(0xffae00)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            { name: `Kézpénz`, value: `**\`${userData.wallet} 💸 \`**`, inline: true },
            { name: `Bank`, value: `**\`${userData.bank} 💳 \`**`, inline: true },
        )
        return interaction.reply({
            embeds: [balanceEmbed]
        })


    }
}