const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const os = require('os')
const moment = require('moment')
const cpuStat = require('cpu-stat')
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('Megmutatja az összes információt a botról.')
        .setDMPermission(false),

    async execute(interaction, client) {

        const message = await interaction.deferReply({ fetchReply: true })


        const days = Math.floor(client.uptime / 86400000)
        const hours = Math.floor(client.uptime / 3600000) % 24 // 1 Day = 24 Hours
        const minutes = Math.floor(client.uptime / 60000) % 60 // 1 Hour = 60 Minutes
        const seconds = Math.floor(client.uptime / 1000) % 60 // I Minute = 60 Seconds

     
        const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        cpuStat.usagePercent(async function (error, percent) {
            if (error) return console.log(error)

            const node = process.version
            const memoryUsage = formatBytes(process.memoryUsage().heapUsed) 
            const CPU = percent.toFixed(2) 
            const CPUModel = os.cpus()[0].model 
            const cores = os.cpus().length
            const BANNER = process.env.banner
            const botverzio = process.env.botverzio
            const supportinv = process.env.supportinv

            const botinfoEmbed = new EmbedBuilder()
                .setTitle(`**${client.user.username} Információi.**`)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({
                    text: `Bot Info`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor(0x82272a)
                .setImage(`${BANNER}`)
                .addFields(
                    { name: `\`🤖\` **Bot Neve:**`, value: `${client.user.username}`, inline: true },
                    //{ name: `\`🤖\` **Bot ID:**`, value: `${client.user.id}`, inline: true },
                    { name: `\`🤖\` **Verzió:**`, value: `${botverzio}`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true }, 
                    //{ name: `\`⏳\` **Bot készítési ideje:**`, value: `${moment.utc(client.user.createdAt).format('LLLL')}`, inline: false },
                    //{ name: `\`⏳\` **Bot csatlakozási ideje:**`, value: `${moment.utc(client.joinedAt).format('LLLL')}`, inline: false },
                    { name: `\`👤\` **Tulajdonos:**`, value: `<@${process.env.devid}>`, inline: true },
                    { name: `\`👌\` **Fejlesztők:**`, value: `<@${process.env.devid}>\n<@${process.env.devid2}>`, inline: true },
                    //{ name: `\u200B`, value: `\u200B`, inline: true }, 
                    //{ name: `\`🔎\` **Összes szerver:**`, value: `${client.guilds.cache.size}`, inline: true },
                    //{ name: `\`👀\` **Összes ember:**`, value: `${totalUsers}`, inline: true },
                    //{ name: `\`🔎\` **Összes csatorna:**`, value: `${client.channels.cache.size.toLocaleString()}`, inline: true },
                    //{ name: `\`⏰\` **Futási idő:**`, value: `\`${days}\` Nap \`${hours}\` Óra \`${minutes}\` Perc \`${seconds}\` Másodperc`, inline: false },
                    //{ name: `\`🏓\` **Ping:**`, value: `*API Latecy: ${client.ws.ping}\n*Client Ping: ${message.createdTimestamp - interaction.createdTimestamp}`, inline: false },
                    //{ name: `\`🧱\` **NodeJS Verzió:**`, value: `${node}`, inline: false },
                    { name: `\u200B`, value: `\u200B`, inline: true }, 
                    { name: `\`🌐\` **Updatek**`, value: `[Megtekintés](https://lily-bot.gitbook.io/lilybot/)`, inline: true },
                    { name: `\`🌐\` **Support Szerver**`, value: `[Csatlakozás](${supportinv})`, inline: true },
                    //{ name: `\`💻\` **Memória használat:**`, value: `${memoryUsage}`, inline: true },
                    //{ name: `\`💻\` **CPU használat:**`, value: `${CPU}`, inline: true },
                    //{ name: `\`💻\` **CPU:**`, value: `${CPUModel}`, inline: true },
                    //{ name: `\`💻\` **Magok:**`, value: `${cores}`, inline: true },
                )
            await interaction.editReply({ embeds: [botinfoEmbed] })
        })


        function formatBytes(a, b) {
            let c = 1024 
            d = b || 2
            e = ['B', 'KB', 'MB', 'GB', 'TB']
            f = Math.floor(Math.log(a) / Math.log(c))

            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
        }

    }
}