const gasModel = require("../models/gas.model");

// [GET] /dashboard
module.exports.index = (req, res) => {
    res.render("pages/dashboard/dashboard.pug");
};

// [POST] /dashboard - Nhận dữ liệu từ NodeMCU
module.exports.updateGasData = (req, res) => {
    try {
        const { gas_level, alert_status } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (typeof gas_level === "number" && typeof alert_status === "string") {
            gasModel.updateGasData(gas_level, alert_status);
            return res.status(200).send("Dữ liệu đã nhận thành công");
        } else {
            throw new Error("Invalid data format");
        }
    } catch (error) {
        console.error("Error in updateGasData:", error.message);
        return res.status(400).send("Dữ liệu không hợp lệ");
    }
};
