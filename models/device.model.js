const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    status: {
        type: String,
        default: "inactive"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    thumbnail: String
}, {
    timestamps: true
});

const Device = mongoose.model("Device", deviceSchema, "devices");

module.exports = Device;