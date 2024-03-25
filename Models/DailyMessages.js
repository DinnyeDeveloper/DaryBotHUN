const mongoose = require("mongoose")

const DailyMessages = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    cooldowns: {
        daily: { type: Date }
    }
})

module.exports = { User: mongoose.model("DailyMessages", DailyMessages) }