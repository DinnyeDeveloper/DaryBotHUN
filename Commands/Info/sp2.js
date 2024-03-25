const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sp2")
        .setDescription("Rang hozzáadása vagy eltávolítása a felhasználóról.")
        .addStringOption(option =>
            option.setName("action")
                .setDescription("A művelet típusa: 'add' (hozzáadás) vagy 'remove' (eltávolítás).")
                .setRequired(true)
                .addChoices(
                    { name: "Hozzáadás", value: "add" },
                    { name: "Eltávolítás", value: "remove" },
                )
        )
        .addStringOption(option =>
            option.setName("role")
                .setDescription("A hozzáadni vagy eltávolítani kívánt szerep neve.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName("target")
                .setDescription("A felhasználó, akiről a szerepet hozzá kell adni vagy eltávolítani.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;

        // Művelet típusának és paramétereinek lekérése
        const action = options.getString("action");
        const roleName = options.getString("role");
        const targetUser = options.getMember("target");

        // Ellenőrzés: művelet típusa csak "add" vagy "remove" lehet
        if (action !== "add" && action !== "remove") {
            return interaction.user.send({ content: "Érvénytelen művelet típusa. Használd a 'add' vagy 'remove' értékeket.", ephemeral: true });
        }

        // Ellenőrzés: a szerep létezik-e a szerveren
        const role = guild.roles.cache.find(role => role.name === roleName);
        if (!role) {
            return interaction.user.send({ content: "A megadott szerep nem található a szerveren.", ephemeral: true });
        }

        try {
            // Szerep hozzáadása vagy eltávolítása a felhasználóról
            if (action === "add") {
                await targetUser.roles.add(role);
                interaction.user.send({ content: `Sikeresen hozzáadtam a ${roleName} szerepet ${targetUser.displayName} felhasználóhoz.`, ephemeral: true });
            } else if (action === "remove") {
                await targetUser.roles.remove(role);
                interaction.user.send({ content: `Sikeresen eltávolítottam a ${roleName} szerepet ${targetUser.displayName} felhasználóról.`, ephemeral: true });
            }
        } catch (error) {
            console.error("Hiba történt a szerep kezelése során:", error);
            return interaction.user.send({ content: "Hiba történt a szerep kezelése során.", ephemeral: true });
        }
    }
};
