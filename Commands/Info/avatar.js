const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(`Fetch a user's avatar from the server`)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription(`The users avatar to fetch`)
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('id')
            .setDescription(`If the user has left, you can enter the user ID`)
            .setRequired(false)
        ),
    async execute(interaction) {
        const { client, member } = interaction;
        const userOption = interaction.options.getUser('user');
        const idOption = interaction.options.getString('id');

        let user;

        if (userOption) {
            user = userOption;
        } else if (idOption) {
            try {
                user = await client.users.fetch(idOption);
            } catch (error) {
                console.error(error);
                await interaction.reply('Hiba a felhasználó lekérdezésében. Kérjük, ellenőrizze, hogy a megadott azonosító érvényes-e.');
                return;
            }
        } else {
            user = member.user;
        }

        const userAvatar = user.displayAvatarURL({ size: 2048, dynamic: true });

        const embed = new EmbedBuilder()
            .setColor('#82272a')
            .setAuthor({ name: `${user.username}'s Avatar`, iconURL: `${user.displayAvatarURL({ size: 64, dynamic: true })}`})
            .setImage(userAvatar)
            .setTimestamp()
            .setFooter({ text: `Felhasználó ID: ${user.id}` });

        const png = new ButtonBuilder()
            .setLabel('PNG')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 2048, format: 'png' }));

        const jpg = new ButtonBuilder()
            .setLabel('JPG')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 2048, format: 'jpg' }));

        const jpeg = new ButtonBuilder()
            .setLabel('JPEG')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 2048, format: 'jpeg' }));

        const gif = new ButtonBuilder()
            .setLabel('GIF')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 2048, format: 'gif' }));

        const row = new ActionRowBuilder().addComponents(png, jpg, jpeg, gif);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [row],
        });
    },
};
