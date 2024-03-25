const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  logoUrl: { type: String },
  banner: { type: String },
  inviteLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  author: { type: String }, // Felhasználó neve
  creatorId: { type: String }, // Felhasználó egyedi azonosítója (ID-je)
});

const Ad = mongoose.model("Ad", AdSchema);

module.exports = Ad;
