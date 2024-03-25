const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const ticketSchema = require('../../Models/Ticket');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('A ticket rendszer felállítása.')
        .addChannelOption(option => option.setName('channel')
        .setDescription('A csatorna, ahová a ticket panelt küldeni kell').setRequired(true).addChannelTypes(ChannelType.GuildText))
        
        .addChannelOption(option => option.setName('category')
        .setDescription('A kategória, amelyben a ticket csatornákat létre fogja hozni').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
        
        .addRoleOption(option => option.setName('role')
        .setDescription('A ticket létrehozásakor pingelni kívánt rang').setRequired(true))
        
        .addChannelOption(option => option.setName('ticket-logs')
        .setDescription('A csatorna, ahová a ticket log-ot küldeni kell').setRequired(true).addChannelTypes(ChannelType.GuildText))
        
        .addStringOption(option => option.setName('description')
        .setDescription('A ticket panel leírása').setRequired(true).setMinLength(1).setMaxLength(1000))
        
        .addStringOption(option => option.setName('color')
        .setDescription('A ticket panel színe')
        .addChoices(
            { name: 'Piros', value: 'Red' },
            { name: 'Kék', value: 'Blue' },
            { name: 'Zöld', value: 'Green' },
            { name: 'Sárga', value: 'Yellow' },
            { name: 'Lila', value: 'Purple' },
            { name: 'Rózsaszín', value: 'DarkVividPink' },
            { name: 'Narancs', value: 'Orange' },
            { name: 'Fekete', value: 'NotQuiteBlack' },
            { name: 'Fehér', value: 'White' },
            { name: 'Szürke', value: 'Gray' },
            { name: 'Sötét kék', value: 'DarkBlue' },
            { name: 'Vörös', value: 'DarkRed' },
        ).setRequired(true)),
 
 
    async execute(interaction, client) {
        try {
        const { options, guild } = interaction;
        const color = options.getString('color');
        const msg = options.getString('description');
        const thumbnail = interaction.guild.iconURL();
        const GuildID = interaction.guild.id;
        const panel = options.getChannel('channel');
        const category = options.getChannel('category');
        const role = options.getRole('role');
        const logs = options.getChannel('ticket-logs');
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'Neked **nincs** engedélyed erre!', ephemeral: true});
        }
 
        const data = await ticketSchema.findOne({ GuildID: GuildID });
        if (data) return await interaction.reply({ content: `Ezen a szerveren **már** be van állítva egy ticket rendszer!`, ephemeral: true});
 
        else {
            await ticketSchema.create({
                GuildID: GuildID,
                Channel: panel.id,
                Category: category.id,
                Role: role.id,
                Logs: logs.id,
            })
 
            const embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTimestamp()
            .setTitle('> Ticket Panel')
            .setAuthor({ name: `🎫 Ticket Rendszer`})
            .setFooter({ text: `🎫 Ticket Panel`})
            .setDescription(`> ${msg} `)
            .setThumbnail(interaction.guild.iconURL())
 
            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticket')
                .setLabel('🎫 Ticket Nyitás')
                .setStyle(ButtonStyle.Primary)
            )
 
            const channel = client.channels.cache.get(panel.id);
            await channel.send({ embeds: [embed], components: [button] });
 
            await interaction.reply({ content: `A ticketed elkészült > ${channel}`, ephemeral: true });
        }
    } catch (err) {
        console.error(err);
    }
}
}
 