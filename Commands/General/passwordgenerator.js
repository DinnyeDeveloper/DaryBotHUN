const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("password-generator")
        .setDescription("Password generation")
        .addNumberOption(option => option
            .setName("length")
            .setDescription("Password length (1-1000)")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(1000))
        .addBooleanOption(option => option
            .setName("capital-letters")
            .setDescription("Add capital letters to your password")
            .setRequired(false))
        .addBooleanOption(option => option
            .setName("lower-case")
            .setDescription("Add lower case letters to your password")
            .setRequired(false))
        .addBooleanOption(option => option
            .setName("numbers")
            .setDescription("Add numbers to the password")
            .setRequired(false))
        .addBooleanOption(option => option
            .setName("symbols")
            .setDescription("Add symbols to the password")
            .setRequired(false))
        .setDMPermission(false),
    async execute(interaction) {


        const { options } = interaction;

        const passwordLength = interaction.options.getNumber("length");
        const includeUppercase = interaction.options.getBoolean("capital-letters") || false;
        const includeLowercase = interaction.options.getBoolean("lower-case") || false;
        const includeNumbers = interaction.options.getBoolean("numbers") || false;
        const includeSymbols = interaction.options.getBoolean("symbols") || false;

        let characters = '';

        if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) characters += '0123456789';
        if (includeSymbols) characters += '!@#$%^&*()_+[]{}|;:,.<>?';

        let password = '';
        if (characters.length > 0) {
            for (let i = 0; i < passwordLength; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters.charAt(randomIndex);
        }
        } else {
            for (let i = 0; i < passwordLength; i++) {
                const randomChar = String.fromCharCode(Math.floor(Math.random() * (127 - 32 + 1)) + 32);
                password += randomChar;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('Generated password')
            .setColor('ffffff')
            .addFields({ name: 'Password', value: `\`\`\`${password}\`\`\`` })
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};