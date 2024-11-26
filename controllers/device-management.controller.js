const Device = require("../models/device.model"); // Giả sử bạn có model device

// [GET] /device-management
module.exports.index = async (req, res) => {
    try {
        // Lấy danh sách thiết bị từ cơ sở dữ liệu
        const devices = await Device.find(); // Đây là truy vấn mẫu, thay đổi nếu bạn cần

        // Nếu chưa có thiết bị, tạo một dữ liệu mẫu
        if (devices.length === 0) {
            const sampleData = [
                {
                    _id: "1",
                    deviceName: "Thiết bị A",
                    isActive: true,
                    createdAt: new Date()
                },
                {
                    _id: "2",
                    deviceName: "Thiết bị B",
                    isActive: false,
                    createdAt: new Date()
                }
            ];
            res.render("pages/device-management/index.pug", {
                pageTitle: "Quản lý thiết bị",
                devices: sampleData
            });
        } else {
            res.render("pages/device-management/index.pug", {
                pageTitle: "Quản lý thiết bị",
                devices: devices
            });
        }
    } catch (error) {
        console.error("Error in fetching devices:", error.message);
        req.flash("error", "Không thể lấy dữ liệu thiết bị");
        res.redirect("/dashboard");
    }
};

// [GET] /device-management/create
module.exports.create = async (req, res) => {
    res.render("pages/device-management/create.pug", {
        pageTitle: "Thêm mới thiết bị"
    })
}

// [POST] /device-management/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    res.send("OK")
}