const express = require("express");
const router = express.Router();

const controller = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware.requireAuth, controller.index); // Hiển thị dashboard
router.post("/", controller.updateGasData); // Nhận dữ liệu từ NodeMCU

module.exports = router;
