const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { User } = require("../../Models/economy");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("penzfeltoltes")
    .setDescription("Pénzfeltöltés a bankba.")
    .addNumberOption(
        option => option
        .setName("amount")
        .setDescription("Add meg a feltölteni kívánt összeget.")
        .setRequired(true)
        .setMinValue(100) //should be more than 100 coins
    ),
    async execute(interaction, client) {
        const user = interaction.member.user,
        amount = interaction.options.getNumber("amount")
        userData = await User.findOne({ id: user.id }) || new User({ id: user.id }),
        embed = new EmbedBuilder({ color: 0xffae00 })

        if (userData.wallet < amount) return interaction.reply({
            embeds: [ embed.setDescription(`💰 Szükséged van \` ${amount - userData.wallet} \` ${process.env.darycoin} több pénzre a pénztárcádban, hogy pénzt fizethess be.`) ],
            ephemeral: true
        })

        userData.wallet -= amount
        userData.bank += amount
        userData.save()

        return interaction.reply({
            embeds: [ embed.setDescription(`${process.env.pipaEmoji} Ön befizettet \` ${amount} \` ${process.env.darycoin} coint a bankszámlájára.`) ]
        })
    }
}
