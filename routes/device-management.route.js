const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer()

const controller = require("../controllers/device-management.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const uploadCloud = require("../middlewares/uploadCloud.middleware")

router.get("/", authMiddleware.requireAuth, controller.index)

router.get("/create", authMiddleware.requireAuth, controller.create)

router.post("/create", upload.single("thumbnail"), uploadCloud.upload, authMiddleware.requireAuth, controller.createPost) 

module.exports = router