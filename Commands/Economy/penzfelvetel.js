const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { User } = require("../../Models/economy");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("penzfelvetel")
    .setDescription("Pénzt tudsz kivenni a bankból.")
    .addNumberOption(
        option => option
        .setName("amount")
        .setDescription("Add meg az összeget.")
        .setRequired(true)
        .setMinValue(100) //should be more than 100 coins
    ),
    async execute(interaction, client) {
        const user = interaction.member.user,
        amount = interaction.options.getNumber("amount")
        userData = await User.findOne({ id: user.id }) || new User({ id: user.id }),
        embed = new EmbedBuilder({ color: 0xffae00 })

        if (userData.bank < amount) return interaction.reply({
            embeds: [ embed.setDescription(`💰 Szükséged van \` ${amount - userData.bank} \` ${process.env.darycoin} több pénzre a bankszámláján, hogy pénzt vehessen fel.`) ],
            ephemeral: true
        })

        userData.bank -= amount
        userData.wallet += amount
        userData.save()

        return interaction.reply({
            embeds: [ embed.setDescription(`${process.env.pipaEmoji} Ön felvett \` ${amount} \` ${process.env.darycoin} coint a bankszámlájáról.`) ]
        })
    }
}