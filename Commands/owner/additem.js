const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { User } = require("../../Models/economy");
const { Targy } = require("../../Models/economyitem");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("targyletrehozas")
    .setDescription("Tárgy létrehozása a bolt számára.")
    .addStringOption((option) =>
      option
        .setName("targynev")
        .setDescription("A létrehozni kívánt tárgy neve.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("ar").setDescription("A tárgy ára.").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("mennyiseg")
        .setDescription("A tárgy elérhető mennyisége.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("rang")
        .setDescription("A tárgyhoz kapcsolható rang.")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const allowedUserIds = [
      process.env.devid,
      process.env.devid2,
      process.env.devid3,
    ];
    if (!allowedUserIds.includes(interaction.user.id)) {
      // Ha a felhasználó nem az engedélyezett felhasználók közé tartozik
      await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor('Red')
                .setDescription(':warning: | Fejlesztői mód Aktiv')
        ],
        ephemeral: true
    });
      return;
    }

    const targyNev = interaction.options.getString("targynev");
    const ar = interaction.options.getInteger("ar");
    const mennyiseg = interaction.options.getInteger("mennyiseg");
    const rang = interaction.options.getString("rang");

    // Az új tárgy létrehozása
    const ujTargy = new Targy({
      nev: targyNev,
      ar: ar,
      mennyiseg: mennyiseg,
      rang: rang,
    });

    // Az új tárgy hozzáadása az adatbázishoz
    await ujTargy.save();

    // Válasz elküldése
    const responseEmbed = new EmbedBuilder()
      .setTitle("Tárgy létrehozva")
      .setDescription(
        `A(z) ${targyNev} tárgy sikeresen létrehozva az árral ${ar}.`
      )
      .setColor(0x00ff00);

    return interaction.reply({
      embeds: [responseEmbed],
    });
  },
  category: `👑`,
};
