const mongoose = require("mongoose");

const gasHistorySchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    gasLevel: { type: Number, required: true },
    alertStatus: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const GasHistory = mongoose.model("GasHistory", gasHistorySchema, "gas-history-data");

module.exports = GasHistory;
