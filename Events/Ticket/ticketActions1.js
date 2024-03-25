const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
 const { createTranscript } = require("discord-html-transcripts");
 const ticketSchema = require("../../Models/Ticket");
const { ButtonBuilder } = require("discord-gamecord/utils/utils");

 module.exports = {
     name: "interactionCreate",

     async execute(interaction) {
        const { customId, guild, channel } = interaction;
        if (interaction.isButton()) {
          if (customId === "ticket") {
            let data = await ticketSchema.findOne({
              GuildID: interaction.guild.id,
            });
       
            if (!data) return await interaction.reply({ content: "A ticket rendszer nincs beállítva ezen a szerveren", ephemeral: true })
            const role = guild.roles.cache.get(data.Role)
            const cate = data.Category;
       
       
            await interaction.guild.channels.create({
              name: `ticket-${interaction.user.username}`,
              parent: cate,
              type: 0,
              permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  deny: ["ViewChannel"]
                },
                {
                  id: role.id,
                  allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                },
                {
                  id: interaction.member.id,
                  allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                },
              ],
            }).then(async (channel) => {
              const openembed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Ticket megnyitva")
                .setDescription(`Üdvözöljük a ticketjén ${interaction.user.username}\n Reagálj a 🔒 gombal a ticket lezárásához`)
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setFooter({ text: `${interaction.guild.name} Ticket` })
       
                const closeButton = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                  .setCustomId('closeticket')
                  .setLabel('Bezárás')
                  .setStyle('Danger')
                  .setEmoji('🔒')
                )
                await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })
       
                const openedTicket = new EmbedBuilder()
                .setDescription(`Sikeresen létrehoztuk a ticketed, <#${channel.id}>`)
       
                await interaction.reply({ embeds: [openedTicket], ephemeral: true })
            })
          }
       
          if (customId === "closeticket") {
            const closingEmbed = new EmbedBuilder()
            .setDescription('🔒 Biztos, hogy be akarja zárni ezt a ticketet?')
            .setColor('Red')
       
            const buttons = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId('yesclose')
              .setLabel('Igen')
              .setStyle('Danger')
              .setEmoji('✅'),
       
              new ButtonBuilder()
              .setCustomId('nodont')
              .setLabel('Nem')
              .setStyle('Secondary')
              .setEmoji('❌')
            )
       
            await interaction.reply({ embeds: [closingEmbed], components: [buttons] })
          }
       
          if (customId === "yesclose") {
            let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
            const transcript = await createTranscript(channel, {
              limit: -1,
              returnBuffer: false,
              filename: `ticket-${interaction.user.username}.html`,
            });
       
            const transcriptEmbed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name} LOG`, iconURL: guild.iconURL() })
            .addFields(
              {name: `Ő zárta be`, value: `${interaction.user.tag}`}
            )
            .setColor('Red')
            .setTimestamp()
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({ text: `${interaction.guild.name} Ticket` })
       
            const processEmbed = new EmbedBuilder()
            .setDescription(` A ticket 10 másodperc múlva bezáródik`)
            .setColor('Red')
       
            await interaction.reply({ embeds: [processEmbed] })
       
            await guild.channels.cache.get(data.Logs).send({
              embeds: [transcriptEmbed],
              files: [transcript],
            });
       
            setTimeout(() => {
              interaction.channel.delete()
            }, 10000);
           }
       
           if (customId === "nodont") {
              const noEmbed = new EmbedBuilder()
              .setDescription('🔒 Ticket bezárása megszakítva.')
              .setColor('Red')
        
              await interaction.reply({ embeds: [noEmbed], ephemeral: true })
           }
        }
      }
    }