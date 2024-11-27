const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/user.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", controller.index); 

router.get("/edit/:id", controller.edit)

router.post("/edit/:id", controller.editPatch)

router.get("/detail/:id", controller.detail)

router.delete("/delete/:id", controller.deleteItem)

router.patch("/change-status/:status/:id", controller.changeStatus)

module.exports = router;