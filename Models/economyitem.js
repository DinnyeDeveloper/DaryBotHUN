const mongoose = require("mongoose")

const Targy = new mongoose.Schema({
    nev: { type: String, unique: true, required: true },
    ar: { type: Number, required: true },
    mennyiseg: { type: Number, default: 1 },
    lejaratIdo: { type: Date },
    rang: { type: String },
    vetel: { type: Number, default: 0 },
    aktív: { type: Boolean, default: true } // Új mező az aktív állapot jelzéséhez
})

module.exports = { Targy: mongoose.model("Targy", Targy) }
