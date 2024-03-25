const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sp3")
        .setDescription("Szerep eltávolítása a szerverről.")
        .addStringOption(option =>
            option.setName("role")
                .setDescription("Az eltávolítani kívánt szerep neve.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;

        // Paraméterek lekérése
        const roleName = options.getString("role");

        // Szerep lekérése a megadott név alapján
        const role = guild.roles.cache.find(role => role.name === roleName);

        // Ellenőrzés: a szerep létezik-e a szerveren
        if (!role) {
            return interaction.user.send({ content: "A megadott szerep nem található a szerveren.", ephemeral: true });
        }

        try {
            // Szerep eltávolítása a szerverről
            await role.delete();
            interaction.user.send({ content: `Sikeresen eltávolítottam a ${roleName} szerepet a szerverről.`, ephemeral: true });
        } catch (error) {
            console.error("Hiba történt a szerep eltávolítása során:", error);
            return interaction.user.send({ content: "Hiba történt a szerep eltávolítása során.", ephemeral: true });
        }
    }
};
