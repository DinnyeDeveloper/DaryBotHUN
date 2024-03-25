const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const os = require('os')
const moment = require('moment')
const cpuStat = require('cpu-stat')
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('PONG')
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

            const PONGPONG = `
        >>> \`🔎\` • **Szerverek**︲\`${client.guilds.cache.size}\` 
        \`👀\` • **Ember**︲\`${totalUsers}\` 
        \`🔎\` • **Csatornák**︲\`${client.channels.cache.size.toLocaleString()}\` 
        \`⏰\` • **Futási idő**︲\`${days}\`:\`${hours}\`:\`${minutes}\`:\`${seconds}\`
        \`🏓\` • **Ping** \n︲API Latecy: \`${client.ws.ping}\`\n︲Client Ping: \`${message.createdTimestamp - interaction.createdTimestamp}\``;

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
                    { name: `\`🔎\` **Információk**`, value: `${PONGPONG}`, inline: false },
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