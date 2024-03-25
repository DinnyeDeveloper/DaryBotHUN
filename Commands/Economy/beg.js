const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { User } = require("../../Models/economy");
require('dotenv').config();

let prettyMilliseconds; // Deklaráljuk a prettyMilliseconds változót

import('pretty-ms').then(module => {
    prettyMilliseconds = module.default; // Állítsuk be a prettyMilliseconds-t a modul default exportjából
}).catch(err => {
    console.error(err);
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("koldul")
        .setDescription("Koldulni tudsz."),
        async execute(interaction, client) {
        const user = interaction.member.user
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
        const embed = new EmbedBuilder({ color: 0xffae00 })

        if (userData.cooldowns.beg > Date.now())
            return interaction.reply({
                embeds: [
                    embed.setDescription(`⌛ Ne koldulj annyit, várj **\`${prettyMilliseconds(userData.cooldowns.beg - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
                ],
                ephemeral: true
            })

        const amount = Math.floor((Math.round(10 / (Math.random() * 10 + 1)) * 10) / 2)

        if (amount <= 5) {
            userData.cooldowns.beg = Date.now() + (60000)
            userData.save()

            return interaction.reply({
                embeds: [embed.setDescription("🥺 Ezúttal nem kaptál semmit, talán legközelebb próbáld meg jobban!")],
            })
        }

        userData.wallet += amount
        userData.cooldowns.beg = Date.now() + (5000)
        userData.save()

        return interaction.reply({
            embeds: [
                embed.setDescription(`😮 Ó, te jó ég! Ennyit kaptál a koldulásért. \` ${amount} \` ${process.env.darycoin}`)
            ]
        })
    }
}