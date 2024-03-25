const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { User } = require("../../Models/economy")
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetmoney')
        .setDescription('Saját, vagy más egyenlegének megtekintése.')
        .addUserOption(
            option => option
            .setName("tag")
            .setDescription("Adj meg egy felhasználót.")
            .setRequired(true)
        ),
    async execute(interaction) {
        const allowedUserIds = [process.env.devid, process.env.devid2, process.env.devid3];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply('Nincs engedélyed használni ezt a parancsot.');
      return;
    }
        const user = interaction.options.getUser("user") || interaction.member.user
        const userData = await User.findOne({ id: user.id}) || new User({ id: user.id })
        
        userData.wallet = 0
        userData.bank = 0
        userData.save()



        const addmoneyEmbed = new EmbedBuilder()
        .setTitle(`${user.username} Egyenlege nullázva.`)
        .setColor(0xffae00)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            { name: `Készpénz:`, value: `**\`${userData.wallet}\` ${process.env.darycoin}**`, inline: true },
            { name: `Bank:`, value: `**\`${userData.bank}\` ${process.env.darycoin}**`, inline: true },
        )
        return interaction.reply({
            embeds: [addmoneyEmbed]
        })


    }
}