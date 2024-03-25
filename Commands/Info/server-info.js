const { SlashCommandBuilder, EmbedBuilder, ChannelType, escapeNumberedList } = require('discord.js');
const Guild = require("../../Models/PremiumGuild");
require('dotenv').config();

 
var timeout = [];


module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('A szerver információit nézheted meg.'),
    async execute(interaction) {








        const { guild } = interaction;

        // Ezt a részt hozzáadod, hogy lekérje az adatbázisból, van-e premium a szerveren

        try {
            const dbGuild = await Guild.findOne({ guildId: guild.id })

            if (dbGuild) {
                const premiumStatus = dbGuild.premium.isEnabled
                    ? `Aktív | ${formatDate(dbGuild.premium.expirationDate)}`
                    : "Nem aktív.";
                const premiumdowntime = dbGuild.premium.isEnabled
                    ? `${formatDate(dbGuild.premium.expirationDate)}`
                    : "---";

        const { members, stickers, role } = guild;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL();
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;
        const channels = interaction.guild.channels.cache.size;
        const category = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size
        const text = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
        const voice = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
        const annnouncement = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement).size
        const stage = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size
        const forum = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size
        const thread = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPublicThread).size
        const rolelist = guild.roles.cache.toJSON().join(' ')
        const rolelist2 = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
        const botCount = members.cache.filter(member => member.user.bot).size
        const vanity = guild.vanityURLCode || 'Nincs'
        const sticker = stickers.cache.size
        const highestrole = interaction.guild.roles.highest
        const animated = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size
        const description = interaction.guild.description || 'Nincs leírás'

        const textchannel_emoji = process.env.textchannel;
        const voicechannel_emoji = process.env.voicechannel;
        const categorys_emoji = process.env.categorys;
        const forums_emoji = process.env.forums;
        const stage_channel_emoji = process.env.stage_channel;
        const threads_emoji = process.env.threads;
        const announcement_channel_emoji = process.env.announcement_channel;



        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };
        const features = guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None"

        let baseVerification = guild.verificationLevel;
 
        if (baseVerification == 0) baseVerification = "None"
        if (baseVerification == 1) baseVerification = "Low"
        if (baseVerification == 2) baseVerification = "Medium"
        if (baseVerification == 3) baseVerification = "High"
        if (baseVerification == 4) baseVerification = "Very High"
 
        const embed = new EmbedBuilder()
        .setColor(0x82272a)
        .setThumbnail(icon)
        .setAuthor({ name: name, iconURL: icon })
        .setDescription(`${description}`)
        .setFooter({ text: `Server ID: ${id}`})
        .setTimestamp()
        .addFields(
        { name: `\`📅\` Készítés ideje`, value: `<t:${parseInt(createdTimestamp / 1000 )}:R>`, inline: true},
        { name: `\`👑\` Tulajdonos`, value: `<@${ownerId}>`, inline: true},
        { name: `\`🌐\` URL`, value: `${vanity}`, inline: true},
        { name: `\`👤\` Tagok`, value: `${memberCount - botCount}`, inline: true},
        { name: `\`🤖\` Botok`, value: `${botCount}`, inline: true},
        { name: `\`⭐\` Emojik száma`, value: `${emojis}`, inline: true},
        { name: `\`⭐\` Animált Emoji száma`, value: `${animated}`, inline: true},
        { name: `\`✨\` Matricák száma`, value: `${sticker}`, inline: true},
        { name: `\`📌\` Rangok száma`, value: `${roles}`, inline: true},
        { name: `\`🥇\` Legmagasabb Rang`, value: `${highestrole}`, inline: true},
        { name: `\`📍\` Ellenőrzési szint`, value: `${baseVerification}`, inline: true},
        { name: `\`🪐\` Boostok száma`, value: `${guild.premiumSubscriptionCount}`, inline: true},
        { name: `\`🔥\` LilyBot Premium`, value: `${premiumStatus}`, inline: true},
        { name: `\`📁\` Csatornák`, value: `\`📁\` Összes: ${channels}\n${categorys_emoji}︲${category}\n${textchannel_emoji}︲${text}\n${voicechannel_emoji}︲${voice}\n${announcement_channel_emoji}︲${annnouncement}\n${stage_channel_emoji}︲${stage}\n${forums_emoji}︲${forum}\n${threads_emoji}︲${thread}`, inline: false},
        { name: `\`📄\` Jellemzők`, value: `\`\`\`${features}\`\`\``},
        )
    

        await interaction.reply({ embeds: [embed] });

            }else {

                const { members, stickers, role } = guild;
                const { name, ownerId, createdTimestamp, memberCount } = guild;
                const icon = guild.iconURL();
                const roles = guild.roles.cache.size;
                const emojis = guild.emojis.cache.size;
                const id = guild.id;
                const channels = interaction.guild.channels.cache.size;
                const category = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size
                const text = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
                const voice = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
                const annnouncement = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement).size
                const stage = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size
                const forum = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size
                const thread = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPublicThread).size
                const rolelist = guild.roles.cache.toJSON().join(' ')
                const rolelist2 = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
                const botCount = members.cache.filter(member => member.user.bot).size
                const vanity = guild.vanityURLCode || 'No vanity'
                const sticker = stickers.cache.size
                const highestrole = interaction.guild.roles.highest
                const animated = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size
                const description = interaction.guild.description || 'No description'
        
                const textchannel_emoji = process.env.textchannel;
                const voicechannel_emoji = process.env.voicechannel;
                const categorys_emoji = process.env.categorys;
                const forums_emoji = process.env.forums;
                const stage_channel_emoji = process.env.stage_channel;
                const threads_emoji = process.env.threads;
                const announcement_channel_emoji = process.env.announcement_channel;

                const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };
        const features = guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None"

        let baseVerification = guild.verificationLevel;
 
        if (baseVerification == 0) baseVerification = "None"
        if (baseVerification == 1) baseVerification = "Low"
        if (baseVerification == 2) baseVerification = "Medium"
        if (baseVerification == 3) baseVerification = "High"
        if (baseVerification == 4) baseVerification = "Very High"



                // Create a new guild entry in the database if it doesn't exist
                const newGuild = new Guild({
                    guildId: id,
                    premium: {
                        isEnabled: false,
                        expirationDate: null,
                    },
                });

                await newGuild.save();
                const newpremiumguild = `Nem aktív.`;

                const embed1 = new EmbedBuilder()
                .setColor(0x82272a)
                .setThumbnail(icon)
                .setAuthor({ name: name, iconURL: icon })
                .setDescription(`${description}`)
                .setFooter({ text: `Server ID: ${id}`})
                .setTimestamp()
                .addFields(
                    { name: `\`📅\` Készítés ideje`, value: `<t:${parseInt(createdTimestamp / 1000 )}:R>`, inline: true},
                    { name: `\`👑\` Tulajdonos`, value: `<@${ownerId}>`, inline: true},
                    { name: `\`🌐\` URL`, value: `${vanity}`, inline: true},
                    { name: `\`👤\` Tagok`, value: `${memberCount - botCount}`, inline: true},
                    { name: `\`🤖\` Botok`, value: `${botCount}`, inline: true},
                    { name: `\`⭐\` Emojik száma`, value: `${emojis}`, inline: true},
                    { name: `\`⭐\` Animált Emoji száma`, value: `${animated}`, inline: true},
                    { name: `\`✨\` Matricák száma`, value: `${sticker}`, inline: true},
                    { name: `\`📌\` Rangok száma`, value: `${roles}`, inline: true},
                    { name: `\`🥇\` Legmagasabb Rang`, value: `${highestrole}`, inline: true},
                    { name: `\`📍\` Ellenőrzési szint`, value: `${baseVerification}`, inline: true},
                    { name: `\`🪐\` Boostok száma`, value: `${guild.premiumSubscriptionCount}`, inline: true},
                    { name: "\`🔥\` LilyBot Premium", value: `${newpremiumguild}`, inline: true},
                    { name: `\`📁\` Csatornák`, value: `\`📁\` Összes: ${channels}\n${categorys_emoji}︲${category}\n${textchannel_emoji}︲${text}\n${voicechannel_emoji}︲${voice}\n${announcement_channel_emoji}︲${annnouncement}\n${stage_channel_emoji}︲${stage}\n${forums_emoji}︲${forum}\n${threads_emoji}︲${thread}`, inline: false},
                    { name: `\`📄\` Jellemzők`, value: `\`\`\`${features}\`\`\``},
                )
                await interaction.reply({
                    embeds: [embed1],
                });
            }
        } catch (error) {
            console.error(error);
            interaction.reply('HIBA történt.');
        }
    },
};

// Függvény a dátum formázására (YYYY/MM/DD - HH/MM)
function formatDate(date) {
    if (!date) return "Nincs prémium";
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('hu', options).format(date);
}

