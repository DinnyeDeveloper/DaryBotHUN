const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gay')
        .setDescription('Egy adott felhasználó összes információja.'),

    async execute(interaction, client) {
        const member = interaction.member;
        let random_number = Math.floor(Math.random() * 100 + 1);
        const gaymember = interaction.user.tag;

        const gayEmbed = new EmbedBuilder()
            .setTitle(`\`💢\` Hőmárő`)
            .setColor(0x82272a)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: `😢 Ohhh.`, value: `${gaymember} \`${random_number}\`%-ban meleg.`, inline: false },
            );
        interaction.reply({ embeds: [gayEmbed] });
    }
}
