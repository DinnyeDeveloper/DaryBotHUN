const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Ad = require('../../Models/Ad');
require('dotenv').config();
const premiumemoji = process.env.premium;
const serverpremiumemoji = process.env.server_premium;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hirdetes-keszites')
        .setDescription('Létrehoz egy hirdetést a LilyBot rendszerben.')
        .addStringOption(option =>
            option.setName('cim')
                .setDescription('A hirdetés címe')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('leiras')
                .setDescription('A hirdetés leírása')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('meghivo_link')
                .setDescription('A szerver meghívó linkje')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('logo_url')
                .setDescription('A hirdetéshez tartozó logo URL (opcionális)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('banner_url')
                .setDescription('A hirdetéshez tartozó banner URL (opcionális)')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const title = interaction.options.getString('cim');
        const description = interaction.options.getString('leiras');
        const inviteLink = interaction.options.getString('meghivo_link');
        const logoURL = interaction.options.getString('logo_url');
        const banner = interaction.options.getString('banner_url');
        const author = interaction.user.tag; // Felhasználói név és diszkriminátor
        const hirdetesekChannel = '1189240000852799589';

        try {
            // URL ellenőrzése (opcionális esetén)
            if ((inviteLink && !isValidUrl(inviteLink))) {
                return interaction.reply('A megadott meghívó link nem érvényes.');
            }
            if ((logoURL && !isValidUrl(logoURL)) || (banner && !isValidUrl(banner))) {
                return interaction.reply('A megadott logo vagy banner link nem érvényes.');
            }

            let id;
            let isUnique = false;

            // Egyedi azonosító generálása
            while (!isUnique) {
                id = generateRandomId();
                isUnique = !(await Ad.exists({ id: id }));
            }

            // Hirdetés létrehozása az adatbázisban
            const newAd = new Ad({
                id: id,
                title: title,
                description: description,
                inviteLink: inviteLink,
                logoUrl: logoURL,
                banner: banner,
                author: author,
            });

            await newAd.save();


            // Visszajelzés küldése
            const embed = new EmbedBuilder()
                .setColor(0x82272a) // Zöld szín
                .setTitle('Hirdetés sikeresen létrehozva')
                .setDescription(`\`💫\` **Cím:** ${title}\n\`✍\` **Leírás:** ${description}\n\n\`📩\` **Meghívó Link:** ${inviteLink}`)
                .setThumbnail(logoURL || client.user.displayAvatarURL()) // .setThumbnail hozzáadva
                .setImage(banner) // .setImage hozzáadva
                .setFooter({ text: `Létrehozta: ${author}`, iconURL: client.user.displayAvatarURL() });

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a hirdetés létrehozása során.');
        }

        try {
            const hirdetesekChannelSend = client.channels.cache.get(hirdetesekChannel);

            if (hirdetesekChannelSend) {
                const hirdetesEmbed = new EmbedBuilder()
                    .setColor(0x82272a) // Zöld szín
                    .setTitle('Új hírdetés 📩')
                    .setDescription(`\`💫\` **Cím:** ${title}\n\`✍\` **Leírás:** ${description}\n\n\`📩\` **Meghívó Link:** ${inviteLink}`)
                    .setThumbnail(logoURL || client.user.displayAvatarURL()) // .setThumbnail hozzáadva
                    .setImage(banner) // .setImage hozzáadva
                    .setFooter({ text: `Létrehozta: ${author}`, iconURL: client.user.displayAvatarURL() });

                await hirdetesekChannelSend.send({ embeds: [hirdetesEmbed] });
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Hiba történt a hirdetés elküldése során.');
        }
    },
    category: `${premiumemoji}`,
};

// URL ellenőrző függvény
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
    
}


// Véletlenszerű 12 számjegyű azonosító generálása
function generateRandomId() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
    
}

