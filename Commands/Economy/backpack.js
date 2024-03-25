const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { User } = require('../../Models/economy');
const { Taska } = require('../../Models/economybackpack');
const { Targy } = require('../../Models/economyitem');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('taska')
        .setDescription('Felhasználó táskájának megtekintése.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('A felhasználó, akinek a táskáját meg szeretnéd tekinteni.')
        ),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user') || interaction.user;
        const taska = await Taska.findOne({ userId: user.id });

        if (!taska) {
            return interaction.reply('A felhasználó táskája üres.');
        }

        // Tárgyak eltávolítása, amelyeknek a mennyisége 0
        taska.targyak = taska.targyak.filter(item => item.mennyiseg > 0);
        await taska.save();

        let totalValue = 0;

        const taskaEmbed = new EmbedBuilder()
            .setTitle(`${user.username} Táskája`)
            .setDescription('\`Itt vannak a táskádban lévő tárgyak.\`')
            .setThumbnail(user.displayAvatarURL())
            .setImage(process.env.backpacklogo)
            .setColor(0x00ff00);

        for (const { targyId, mennyiseg } of taska.targyak) {
            const targy = await Targy.findById(targyId);

            if (!targy) {
                // Kezeljük a hiányzó tárgyat
                taskaEmbed.addFields(
                    { name: '- Hiányzó tárgy', value: `Mennyiség: \`${mennyiseg} db\`` }
                );
            } else {
                const itemValue = targy.ar * mennyiseg;
                totalValue += itemValue;

                taskaEmbed.addFields(
                    { name: `**${targy.nev}**`, value: `Mennyiség: \`${mennyiseg} db\` Ár: \`${targy.ar}/db\` ${process.env.darycoin}`, inline: true }
                );
            }
        }

        taskaEmbed.addFields(
            { name: 'Összérték', value: `\`${totalValue}\` ${process.env.darycoin}` }
        );
        
        return interaction.reply({
            embeds: [taskaEmbed],
        });
    },
};
