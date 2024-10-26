const express = require("express")
const router = express.Router()

const controller = require("../controllers/history.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/", authMiddleware.requireAuth, controller.index)

module.exports = router