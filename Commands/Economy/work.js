const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { User } = require("../../Models/economy");
require('dotenv').config();

let prettyMilliseconds; // Deklaráljuk a prettyMilliseconds változót

import('pretty-ms').then(module => {
    prettyMilliseconds = module.default; // Állítsuk be a prettyMilliseconds-t a modul default exportjából
}).catch(err => {
    console.error(err);
});

const jobs = [
    "🧑‍🏫 Tanár",
    "🧑‍⚕️ Orvos",
    "👮 Rendőr",
    "🧑‍🍳 szakács",
    "🧑‍🚒 tűzoltó",
    "🚌 buszvezető",
    "🧑‍🔬 Tudós",
    "📮 Postás",
    "🧑‍🏭 Mérnök",
    "🧑‍🎨 művész",
    "🧑‍✈️ Pilóta"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("munka")
        .setDescription("Dolgozz hogy pénzt keress."),
    async execute(interaction, client) {
        if (!prettyMilliseconds) {
            return interaction.reply({
                content: "The 'pretty-ms' module is not available. Please make sure it's properly installed.",
                ephemeral: true
            });
        }

        const user = interaction.member.user;
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

        if (userData.cooldowns.work > Date.now())
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffae00)
                        .setDescription(`⌛ Várj. Ne dolgozz olyan sokat. **\`${prettyMilliseconds(userData.cooldowns.work - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
                ],
                ephemeral: true
            });

        const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        const job = jobs[Math.floor(Math.random() * jobs.length)];

        userData.wallet += amount;
        userData.cooldowns.work = Date.now() + (5000);
        userData.save();

        const workEmbed = new EmbedBuilder()
            .setDescription(`Ön dolgozott  **\` ${job} \`** és keresett \` ${amount} \` ${process.env.darycoin} coint.`)
            .setColor(0xffae00);

        return interaction.reply({ embeds: [workEmbed] });
    }
};
