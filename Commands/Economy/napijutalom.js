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
        .setName("napijutalom")
        .setDescription("Le tudod venni a napi jutalmad."),
        async execute(interaction, client) {
        const user = interaction.member.user
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
        const embed = new EmbedBuilder({ color: 0xffae00 })

        if (userData.cooldowns.daily > Date.now()) return interaction.reply({
            embeds: [
                embed.setDescription(`⌛ Ön már összegyűjtötte a pénzt, várjon **\`${prettyMilliseconds(userData.cooldowns.daily - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
            ],
            ephemeral: true
        })

        userData.wallet += 50
        userData.cooldowns.daily = new Date().setHours(24,0,0,0)
        userData.save()

        return interaction.reply({
            embeds: [ embed.setDescription(`💰 Összegyűjtötted a napi \` 50 \` ${process.env.darycoin} coint.`) ]
        })
        
    }
}