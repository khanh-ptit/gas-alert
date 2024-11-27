const express = require("express");
const router = express.Router();
const multer = require("multer")
const upload = multer()

const controller = require("../../controllers/admin/device.controller");
const uploadCloud = require("../../middlewares/uploadCloud.middleware")
// const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", controller.index); 

router.delete("/delete/:id", controller.deleteItem)

router.patch("/change-status/:status/:id", controller.changeStatus)

router.get("/create", controller.create)

router.post("/create", upload.single("thumbnail"), uploadCloud.upload, controller.createPost) 

router.get("/edit/:id", controller.edit)

router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.upload, controller.editPatch)

router.get("/detail/:id", controller.detail)

module.exports = router;