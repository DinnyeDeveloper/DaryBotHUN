const {EmbedBuilder} = require('@discordjs/builders');
const {GuildMember} = require('discord.js');
const Schema = require('../../Models/Welcome');

module.exports = {
    name: "guidlMemberAdd",
    async execute(member) {
        Schema.findOne({Guild: member.guild.id}, async (err, data) => {
            if (!data) return;
            let Channel = data.Channel;
            let Msg = data.Msg || " ";
            let Role = data.Roles;

            const {user, guild} = member;
            const welcomeChannel = member.guild.channel.cache.get(data.Channel);

            const welcomeEmbed = new EmbedBuilder()
            .setTitle("Újonc")
            .setDescription(data.Msg)
            .setColor(0xffae00)
            .addFields({name: 'Összes játékos', value: `${guild.memberCount}`})
            .setTimestamp();

            welcomeChannel.send({embeds: [welcomeEmbed]});
            member.roles.add(data.Role);
        })
    }
}