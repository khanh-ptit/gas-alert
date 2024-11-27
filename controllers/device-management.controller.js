const Device = require("../models/device.model"); 
const paginationHelper = require("../helpers/pagination")

// [GET] /device-management
module.exports.index = async (req, res) => {
    try {
        const user = res.locals.user;

        // Lấy danh sách ID thiết bị của người dùng
        const userDeviceIds = user.devices || [];

        // Điều kiện tìm kiếm thiết bị của người dùng
        let find = {
            _id: { $in: userDeviceIds }, // Chỉ lấy thiết bị trong danh sách của user
            deleted: false
        };

        // Pagination
        const countRecord = await Device.countDocuments(find); // Tổng số thiết bị phù hợp
        let objectPagination = paginationHelper({
            currentPage: 1,
            limitItems: 4
        }, req.query, countRecord);

        // Lấy thiết bị theo trang
        const devices = await Device
            .find(find)
            .skip(objectPagination.skip)
            .limit(objectPagination.limitItems);

        // Render dữ liệu ra view
        res.render("pages/device-management/index.pug", {
            pageTitle: "Danh sách thiết bị",
            devices: devices,
            pagination: objectPagination
        });

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
    const newDevice = new Device(req.body)
    console.log(newDevice)
    await newDevice.save()
    req.flash("success", "Tạo mới thiết bị thành công!")
    res.redirect("/device-management")
}

// [DELETE] /device-management/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Device.updateOne({
        _id: id
    }, {
        deleted: true
    })
    req.flash("success", "Xóa thiết bị thành công!")
    res.redirect("back")
}