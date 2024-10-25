const express = require("express")
const router = express.Router()

const controller = require("../controllers/user.controller")

router.get("/login", controller.login)

router.get("/register", controller.register)

router.get("/forgot-password", controller.forgotPassword)

module.exports = router