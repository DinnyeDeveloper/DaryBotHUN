const mongoose = require("mongoose");

const PremiumGuildSchema = new mongoose.Schema({
  guildId: { type: String, unique: true, required: true }, // Discord szerver ID-ja
  premium: {
    isEnabled: { type: Boolean, default: false }, // Van-e prémium rendszer a szerveren
    expirationDate: { type: Date }, // Prémium lejárati dátuma
  },
});

const Guild = mongoose.model("PremiumGuild", PremiumGuildSchema);

module.exports = Guild;
