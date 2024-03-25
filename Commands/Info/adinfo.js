const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Ad = require('../../Models/Ad');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hirdetes-info')
        .setDescription('Megjeleníti egy hirdetés részleteit')
        .addStringOption(option =>
            option.setName('hirdetes_id')
                .setDescription('A hirdetés azonosítója')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const adId = interaction.options.getString('hirdetes_id');

        try {
            const ad = await Ad.findOne({ id: adId });

            if (!ad) {
                return interaction.editReply('Nincs ilyen azonosítójú hirdetés.');
            }

            const embed = new EmbedBuilder()
                .setTitle(ad.title)
                .setDescription(ad.description)
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: '\`🆔\`' + ' Hirdetés ID', value: ad.id, inline: true },
                    { name: '\`📅\`' + ' Létrehozva', value: new Date(ad.createdAt).toLocaleString(), inline: true },
                    { name: '\`👤\`' + ' Készítő', value: ad.author || 'Ismeretlen', inline: true },
                )
                .setThumbnail(ad.logoUrl) // .setThumbnail hozzáadva
                .setImage(ad.banner) // .setImage hozzáadva
                .setFooter({ text: `Létrehozta: ${ad.author}`, iconURL: client.user.displayAvatarURL() })
                .setColor(0x82272a) // Zöld szín

            const button = new ButtonBuilder()
                .setURL(ad.inviteLink)
                .setLabel('💖 Csatlakozás')
                .setStyle('Link');

            const row = new ActionRowBuilder().addComponents(button);

            interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(error);
            interaction.editReply('Hiba történt a hirdetés részleteinek lekérése során.');
        }
    },
};
