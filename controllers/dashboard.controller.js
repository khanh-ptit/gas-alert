const gasModel = require("../models/gas.model");
const sendMailHelper = require("../helpers/sendMail"); // Đảm bảo helper này được import
const GasHistory = require("../models/gasHistory.model"); // Import GasHistory model
const io = require('socket.io'); // Đảm bảo bạn đã khởi tạo socket.io trên server

let threshold = 600; // Giá trị ngưỡng mặc định
let isAlertSent = false; // Trạng thái gửi email cảnh báo
let alertResetTimeout = null; // Biến để lưu bộ đếm thời gian reset
let lastSaveTime = null; // Biến lưu thời gian của lần lưu trước đó

// [GET] /dashboard - Hiển thị giao diện Dashboard
module.exports.index = (req, res) => {
    // console.log("Session data:", req.session);
    // const email = req.session.email;
    // console.log(email)
    res.render("pages/dashboard/dashboard.pug", {
        pageTitle: "Trang Tổng Quan"
    });
};

// [POST] /dashboard - Nhận dữ liệu từ NodeMCU
module.exports.updateGasData = async (req, res) => {
    try {
        const { gas_level } = req.body;
        const now = new Date();

        // Kiểm tra định dạng dữ liệu hợp lệ
        if (typeof gas_level === "number") {
            // Xác định alertStatus dựa trên gasLevel
            const alert_status = gas_level < 600 ? "Tắt" : "Bật";

            // Lưu dữ liệu vào model Gas
            gasModel.updateGasData(gas_level, alert_status);

            // Chỉ lưu dữ liệu một lần trong vòng 1 phút
            if (!lastSaveTime || (now - lastSaveTime) > 60000) { // Kiểm tra 1 phút
                const minutes = now.getMinutes();
                // Kiểm tra xem có phải mốc thời gian 5 phút không (ví dụ 10h00, 10h05, 10h10,...)
                if (minutes % 5 === 0) {
                    // Lưu lịch sử khí gas vào GasHistory
                    const gasHistory = new GasHistory({
                        userEmail: 'itlmh23@gmail.com', // Sử dụng email của người dùng hiện tại
                        gasLevel: gas_level,
                        alertStatus: alert_status,
                        timestamp: now
                    });
                    // await gasHistory.save(); // Lưu vào cơ sở dữ liệu
                    console.log(gasHistory);
                    console.log("Lịch sử khí gas đã được lưu.");
                    // Cập nhật lại thời gian lưu dữ liệu
                    lastSaveTime = now;
                }
            }

            // Kiểm tra nếu vượt ngưỡng và chưa gửi email
            if (gas_level > threshold && !isAlertSent) {
                const userEmail = 'itlmh23@gmail.com';

                if (userEmail) {
                    const subject = "Cảnh báo: Nồng độ khí gas vượt ngưỡng!";
                    const html = `<!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
                                .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
                                .email-header { background: #ff6f61; color: #ffffff; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; }
                                .email-body { padding: 20px; }
                                .email-body p { margin: 0 0 15px; }
                                .email-body ul { list-style-type: none; padding: 0; }
                                .email-body ul li { margin-bottom: 10px; padding: 10px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; }
                                .email-footer { background: #f2f2f2; padding: 10px; text-align: center; font-size: 14px; color: #555; }
                                .email-footer a { color: #ff6f61; text-decoration: none; }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="email-header">Cảnh Báo Khẩn Cấp</div>
                                <div class="email-body">
                                    <p>Chào bạn,</p>
                                    <p>Hệ thống giám sát đã phát hiện nồng độ khí gas vượt ngưỡng an toàn:</p>
                                    <ul>
                                        <li><strong>Nồng độ khí gas:</strong> ${gas_level} ppm</li>
                                        <li><strong>Ngưỡng an toàn:</strong> ${threshold} ppm</li>
                                    </ul>
                                    <p style="color: #d9534f; font-weight: bold;">Vui lòng kiểm tra ngay lập tức và thực hiện các biện pháp an toàn!</p>
                                    <p>Trân trọng,</p>
                                    <p>Hệ thống Giám sát Khí Gas</p>
                                </div>
                                <div class="email-footer">
                                    <p>Nếu bạn cần hỗ trợ, hãy <a href="mailto:support@example.com">liên hệ với chúng tôi</a>.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `;

                    // Gửi email
                    await sendMailHelper.sendMail(userEmail, subject, html);
                    console.log(`Cảnh báo đã được gửi đến email: ${userEmail}`);

                    // Đánh dấu đã gửi email
                    isAlertSent = true;

                    // Đặt lại trạng thái sau 30 giây
                    if (alertResetTimeout) clearTimeout(alertResetTimeout);
                    alertResetTimeout = setTimeout(() => {
                        isAlertSent = false;
                        console.log("Trạng thái gửi email đã được reset.");
                    }, 30000); // 30 giây
                }
            }

            return res.status(200).send("Dữ liệu đã nhận thành công");
        } else {
            throw new Error("Invalid data format");
        }
    } catch (error) {
        console.error("Error in updateGasData:", error.message);
        return res.status(400).send("Dữ liệu không hợp lệ");
    }
};



// [GET] /api/threshold - Trả về giá trị ngưỡng hiện tại
module.exports.getThreshold = (req, res) => {
    try {
        res.status(200).json({ threshold });
    } catch (error) {
        console.error("Lỗi khi lấy giá trị threshold:", error.message);
        res.status(500).send("Lỗi máy chủ");
    }
};


// [POST] /api/threshold - Cập nhật giá trị ngưỡng từ Dashboard
module.exports.updateThreshold = (req, res) => {
    try {
        const { newThreshold } = req.body;

        if (typeof newThreshold === "number" && newThreshold > 0) {
            threshold = newThreshold;

            // Lấy io từ req và phát sự kiện WebSocket
            if (req.io) {
                req.io.emit("thresholdUpdated", { threshold }); // Gửi threshold mới qua WebSocket
            }
            console.log("Ngưỡng mới được gửi đến phần cứng:", threshold);

            return res.status(200).send("Ngưỡng cảnh báo đã được cập nhật");
        } else {
            throw new Error("Giá trị ngưỡng không hợp lệ");
        }
    } catch (error) {
        console.error("Lỗi trong updateThreshold:", error.message);
        return res.status(400).send("Dữ liệu không hợp lệ");
    }
};

// Các phần khác của controller (nếu có) giữ nguyên
