const Device = require("../../models/device.model")
const paginationHelper = require("../../helpers/pagination")
const searchHelper = require("../../helpers/search")
const filterStatusHelper = require("../../helpers/filterStatus")

// [GET] /admin/devices
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted: false
    }

    if (req.query.status) {
        find["status"] = req.query.status
    }

    // Pagination
    const countDevices = await Device.countDocuments(find)
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countDevices)

    // Form search
    const objectSearch = searchHelper(req.query)
    if (objectSearch["regex"]) {
        find["name"] = objectSearch["regex"]
    }

    // Sort
    let sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.createdAt = "desc"
    }

    const devices = await Device.find(find)
        .skip(objectPagination.skip)
        .limit(objectPagination.limitItems)
        .sort(sort)

    res.render("pages/admin/devices/index.pug", {
        pageTitle: "Danh sách thiết bị",
        devices: devices,
        filterStatus: filterStatus,
        pagination: objectPagination,
        keyword: objectSearch.keyword
    })
}

// [PATCH] /admin/devices/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    await Device.updateOne({
        _id: id
    }, {
        status: status
    })
    req.flash("success", "Cập nhật trạng thái thành công !")
    res.redirect("back")
}

// [DELETE] /admin/devices/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
    await Device.updateOne({
        _id: id
    }, {
        deleted: true
    })
    req.flash("success", "Đã xóa thiết bị !")
    res.redirect("back")
}

// [GET] /admin/devices/create
module.exports.create = async (req, res) => {
    res.render("pages/admin/devices/create.pug", {
        pageTitle: "Tạo mới thiết bị"
    })
}

// [POST] /admin/devices/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    const newDevice = new Device(req.body)
    console.log(newDevice)
    await newDevice.save()
    req.flash("success", "Tạo mới thiết bị thành công!")
    res.redirect("/admin/devices")
}

// [GET] /admin/devices/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id
    const device = await Device.findOne({
        _id: id,
        deleted: false
    })
    res.render("pages/admin/devices/edit.pug", {
        pageTitle: "Chỉnh sửa thiết bị",
        device: device
    })
}

// [PATCH] /admin/devices/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    await Device.updateOne({
        _id: id
    }, req.body)
    req.flash("success", "Cập nhật thành công thiết bị !")
    res.redirect("back")
}

// [GET] /admin/devices/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id
    const device = await Device.findOne({
        _id: id
    })
    res.render("pages/admin/devices/detail.pug", {
        pageTitle: "Chi tiết thiết bị",
        device: device
    })
}