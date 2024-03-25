const mongoose = require("mongoose");

const PremiumUserSchema = new mongoose.Schema({
  discordId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  premium: {
    isEnabled: { type: Boolean, default: false },
    expirationDate: { type: Date },
  },
});

const User = mongoose.model("PremiumUser", PremiumUserSchema);

module.exports = User;
