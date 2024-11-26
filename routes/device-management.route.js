const express = require("express")
const router = express.Router()

const controller = require("../controllers/device-management.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/", authMiddleware.requireAuth, controller.index)

router.get("/create", authMiddleware.requireAuth, controller.create)

module.exports = router