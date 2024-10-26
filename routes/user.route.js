const express = require("express")
const router = express.Router()

const controller = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/login", controller.login)

router.get("/register", controller.register)

router.get("/forgot-password", controller.forgotPassword)

router.post("/forgot-password", controller.forgotPasswordPost)

router.get("/otp-password", controller.otpPassword)

router.post("/otp-password", controller.otpPasswordPost)

router.get("/reset-password", authMiddleware.requireAuth, controller.resetPassword)

router.post("/reset-password", authMiddleware.requireAuth, controller.resetPasswordPost)

router.post("/register", controller.registerPost)

router.post("/login", controller.loginPost)

router.get("/logout", controller.logOut)

module.exports = router