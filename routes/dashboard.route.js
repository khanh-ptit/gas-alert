// const express = require("express");
// const router = express.Router();

// const controller = require("../controllers/dashboard.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

// router.get("/", authMiddleware.requireAuth, controller.index); // Hiển thị dashboard
// router.post("/", controller.updateGasData); // Nhận dữ liệu từ NodeMCU
// router.get("/api/threshold", controller.getThreshold); // API lấy giá trị threshold
// router.post("/api/threshold", controller.updateThreshold); // API cập nhật giá trị threshold

// module.exports = router;

const express = require("express");
const router = express.Router();

const controller = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware.requireAuth, controller.index); // Hiển thị dashboard, yêu cầu xác thực
router.post("/", controller.updateGasData); 
router.get("/api/threshold", authMiddleware.requireAuth, controller.getThreshold); // API lấy giá trị threshold, yêu cầu xác thực
router.post("/api/threshold", authMiddleware.requireAuth, controller.updateThreshold); // API cập nhật giá trị threshold, yêu cầu xác thực

module.exports = router;

