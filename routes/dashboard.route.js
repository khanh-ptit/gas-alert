const express = require("express");
const router = express.Router();

const controller = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware.requireAuth, controller.index); // Hiển thị dashboard, yêu cầu xác thực
router.post("/", controller.updateGasData); 
router.get("/api/threshold", controller.getThreshold); 
router.post("/api/threshold", controller.updateThreshold); 

module.exports = router;
