const mongoose = require("mongoose")

const Taska = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    targyak: [
        {
            targyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Targy', required: true },
            mennyiseg: { type: Number, default: 1 }
        }
    ]
})

module.exports = { Taska: mongoose.model("Taska", Taska) }