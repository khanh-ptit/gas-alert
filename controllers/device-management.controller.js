const Device = require("../models/device.model"); 
const paginationHelper = require("../helpers/pagination")
// [GET] /device-management
module.exports.index = async (req, res) => {
    try {
        // Lấy danh sách thiết bị từ cơ sở dữ liệu
        let find = {
            deleted: false
        }

        // Pagination
        const countRecord = await Device.countDocuments(find)
        let objectPagination = paginationHelper({
            currentPage: 1,
            limitItems: 4
        }, req.query, countRecord)

        const devices = await Device
            .find(find)
            .skip(objectPagination.skip)
            .limit(objectPagination.limitItems)        

        res.render("pages/device-management/index.pug", {
            pageTitle: "Quản lý thiết bị",
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