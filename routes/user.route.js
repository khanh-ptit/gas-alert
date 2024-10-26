const express = require("express")
const router = express.Router()

const controller = require("../controllers/user.controller")

router.get("/login", controller.login)

router.get("/register", controller.register)

router.get("/forgot-password", controller.forgotPassword)

router.post("/register", controller.registerPost)

router.post("/login", controller.loginPost)

router.get("/logout", controller.logOut)

module.exports = router