const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Töröl egy megadott üzenet mennyiséget a csatornán ahol használod.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Mennyi üzenetet töröljek?')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .addUserOption(option =>
            option.setName('target')
                .setDescription('asd')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const amount = options.getInteger('amount');
        const target = options.getUser("target");

        const messages = await channel.messages.fetch({
            limit: amount + 1,
        });

        const res = new EmbedBuilder()
            .setColor(0xffae00)

        if (target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
            try {
                await channel.bulkDelete(filtered).then(async messages => {
                    res.setDescription(`Sikeresen törölve lett ${messages.size} ${target}.`);
                    const replyMessage = await interaction.reply({ embeds: [res] })
                    setTimeout(() => {
                        replyMessage.delete();
                    }, 5000);
                });
            } catch (error) {
                console.error(error)
                const errorMessage = await interaction.reply({ content: `Hiba történt a törlés közben.` })
                setTimeout(() => {
                    errorMessage.delete;
                }, 5000);
            }
        } else {
            try {
                await channel.bulkDelete(amount, true).then(async messages => {
                    res.setDescription(`Sikeresen törölve lett ${messages.size}.`);
                    const replyMessage = await interaction.reply({ embeds: [res] });
                    setTimeout(() => {
                        replyMessage.delete();
                    }, 5000);
                });
            } catch (error) {
                console.error(error)
                interaction.reply({ content: `Hiba történt a törlés közben.` })
            }
        }
    }
}