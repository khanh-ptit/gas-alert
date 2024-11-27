const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

router.get("/login", controller.login); 

router.post("/login", controller.loginPost)

router.get("/logout", controller.logOut)

module.exports = router;