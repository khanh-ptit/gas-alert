const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: () => generate.generateRandomString(30)
    },
    phone: String,
    avatar: {
        type: String,
        default: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
    },
    address: String,
    deleted: {
        type: Boolean,
        default: false
    },
    numberDevice: {
        type: Number,
        default: 0
    },
    // Lưu mảng các ID thiết bị
    devices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device' // Trỏ tới model 'Device'
        }
    ]
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema, "users")

module.exports = User
