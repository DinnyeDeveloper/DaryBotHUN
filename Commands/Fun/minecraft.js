const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('advancement')
        .setDescription('Generates a Minecraft Advancement')
        .addStringOption(option =>
            option.setName('cim')
                .setDescription('Ad meg a címet.')
                .setMaxLength(21)
                .setRequired(true))
        .addStringOption(option =>
                option.setName('leiras')
                    .setDescription('Add meg a leírást.')
                    .setMaxLength(21)
                    .setRequired(true))
        .addStringOption(option =>
            option.setName('icon')
                .setDescription('Ikonok első része.')
                .setRequired(false)
                .addChoices(
                    { name: 'Stone', value: '20' },
                    { name: 'Grass', value: '1' },
                    { name: 'Wooden Plank', value: '21' },
                    { name: 'Crafting Table', value: '13' },
                    { name: 'Furnace', value: '18' },
                    { name: 'Chest', value: '17' },
                    { name: 'Bed', value: '9' },
                    { name: 'Coal', value: '31' },
                    { name: 'Iron', value: '22' },
                    { name: 'Gold', value: '23' },
                    { name: 'Diamond', value: '2' },
                    { name: 'Sign', value: '11' },
                    { name: 'Book', value: '19' },
                    { name: 'Wooden Door', value: '22' },
                    { name: 'Iron Door', value: '25' },
                    { name: 'Redstone', value: '14' },
                    { name: 'Rail', value: '12' },
                    { name: 'Bow', value: '33' },
                    { name: 'Arrow', value: '34' },
                    { name: 'Iron Sword', value: '32' },
                    { name: 'Diamond Sword', value: '3' },
                    { name: 'Iron Chestplate', value: '35' },
                    { name: 'Diamond Chestplate', value: '26' },
                    { name: 'TNT', value: '6' },
                    { name: 'Flint and Steel', value: '27' },
                ))
        .addStringOption(option =>
            option.setName('icon2')
                .setDescription('Ikonok első része.')
                .setRequired(false)
                .addChoices(
                    { name: 'Fire', value: '15' },
                    { name: 'Bucket', value: '36' },
                    { name: 'Water Bucket', value: '37' },
                    { name: 'Lava Bucket', value: '38' },
                    { name: 'Cookie', value: '7' },
                    { name: 'Cake', value: '10' },
                    { name: 'Creeper', value: '4' },
                    { name: 'Pig', value: '5' },
                    { name: 'Spawn Egg', value: '30' },
                    { name: 'Heart', value: '8' },
                    { name: 'Cobweb', value: '16' },
                    { name: 'Potion', value: '28' },
                    { name: 'Splash Potion', value: '29' },
                )),
    async execute(interaction,client ) {

        const one_icon = new EmbedBuilder()
            .setTitle('⚠️ Error!')
            .setDescription(`**Csak 1 ikont adhatsz meg.**`)
            .setColor("Red")
        const no_icon = new EmbedBuilder()
            .setTitle('⚠️ Error!')
            .setDescription(`**Egy ikont meg kell adnod.**`)
            .setColor("Red")
            
        icon = interaction.options.getString('icon');
        icon2 = interaction.options.getString('icon2');

        icon = icon || icon2;

        if (!icon) return interaction.reply({ embeds: [no_icon], ephemeral: true });
        if (icon2 && icon !== icon2) return interaction.reply({ embeds: [one_icon], ephemeral: true });

        const cim = interaction.options.getString('cim').replace(/\s/g, '+');
        const leiras = interaction.options.getString('leiras').replace(/\s/g, '+');

        const advancement = new EmbedBuilder()
	        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor(0x82272a)
            .setImage(`https://skinmc.net/achievement/${icon}/${cim}/${leiras}`)
            
        return await interaction.reply({ embeds: [advancement] });
    },
};