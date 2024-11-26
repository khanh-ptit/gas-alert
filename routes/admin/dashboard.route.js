const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/dashboard.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", controller.index); // Hiển thị dashboard, yêu cầu xác thực

module.exports = router;