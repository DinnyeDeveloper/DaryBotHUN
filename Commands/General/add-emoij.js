const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-emoji')
        .setDescription('Hozá add egy megadott emojit a szerverhez.')
        .addAttachmentOption(option => option.setName('emoji').setDescription('Hozzá add.').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('Add meg az emoji nevét.').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({ content: 'Nincs ehez jogod.', ephemeral: true })
        const upload = interaction.options.getAttachment('emoji');
        const name = interaction.options.getString('name');

        await interaction.reply({ content: `<a:loading:1164239328281632828> Emoji Betöltése...` });
        const emoji = await interaction.guild.emojis.create({ attachment: `${upload.attachment}`, name: `${name}` }).catch(err => {

                setTimeout(() => {
                    console.log(err.rawError.message);
                    return interaction.editReply({ content: `<:ix:1121005832591655002> Hiba történt: \`${err.rawError.message}\`` });
                }, 2000)
        })

        setTimeout(() => {
            if (!emoji) return;

            const embed = new EmbedBuilder()
                .setColor(0x82272a)
                .setDescription(`<:pipa:1121005563740950560> Hozzá lett adva az emoji. (${emoji})`)

            interaction.editReply({ content: ``, embeds: [embed] });
        }, 3000)
    }
}