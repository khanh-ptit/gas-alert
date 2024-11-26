const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/user.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", controller.index); 

router.get("/edit/:id", controller.edit)

module.exports = router;