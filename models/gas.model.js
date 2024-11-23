// models/gas.model.js

// Khởi tạo dữ liệu ban đầu
let gasData = {
    gas_level: 0, // Nồng độ khí gas (ppm)
    alert_status: false, // Trạng thái cảnh báo (true nếu vượt ngưỡng)
};

module.exports = {
    /**
     * Lấy dữ liệu hiện tại về nồng độ khí gas
     * @returns {Object} - Dữ liệu nồng độ khí gas
     */
    getGasData: () => {
        return gasData;
    },

    /**
     * Cập nhật dữ liệu nồng độ khí gas
     * @param {number} gasLevel - Giá trị nồng độ khí gas mới
     * @param {string} alertStatus - Trạng thái cảnh báo ("Bật" hoặc "Tắt")
     */
    updateGasData: (gasLevel, alertStatus) => {
        gasData.gas_level = gasLevel;
        gasData.alert_status = alertStatus === "Bật"; // Chuyển thành boolean
    },
};
