const User = require("../../models/user.model")
const Device = require("../../models/device.model")
const paginationHelper = require("../../helpers/pagination")
const searchHelper = require("../../helpers/search")
const filterStatusHelper = require("../../helpers/filterStatus")

// [GET] /admin/users
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted: false
    }

    if (req.query.status) {
        find["status"] = req.query.status
    }

    // Pagination
    const countAccounts = await User.countDocuments(find)
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countAccounts)

    // Form search
    const objectSearch = searchHelper(req.query)
    if (objectSearch["regex"]) {
        find["fullName"] = objectSearch["regex"]
    }
    
    // console.log(find)

    // Sort
    let sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.createdAt = "desc"
    }

    const users = await User.find(find)
        .skip(objectPagination.skip)
        .limit(objectPagination.limitItems)
        .sort(sort)

    // console.log(users)
    res.render("pages/admin/users/index.pug", {
        pageTitle: "Danh sách người dùng",
        filterStatus: filterStatus,
        records: users,
        pagination: objectPagination,
        keyword: objectSearch.keyword
    })
}

// [GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).populate('devices');
        const devices = await Device.find(); // Lấy tất cả các thiết bị có sẵn
        if (!user) {
            return res.status(404).send("Người dùng không tồn tại");
        }
        const filteredDevices = await Device.find();

        res.render("pages/admin/users/edit.pug", {
            pageTitle: "Chỉnh sửa người dùng",
            user: user,
            devices: devices, // Truyền danh sách thiết bị vào view
            filteredDevices: filteredDevices
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Có lỗi xảy ra khi tải dữ liệu");
    }
};

// [POST] /admin/users/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const { fullName, email, phone, address, devices } = req.body;
        // console.log(req.body); // Kiểm tra thông tin gửi lên

        // Tìm người dùng theo ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Người dùng không tìm thấy.");
        }

        // Kiểm tra nếu không có thiết bị mới được gửi lên
        let allDeviceIds = user.devices.map(device => device._id.toString()); // Giữ lại thiết bị cũ nếu không có thiết bị mới
        if (devices && devices.length > 0) {
            // Nếu có thiết bị mới, kết hợp với thiết bị cũ
            const existingDeviceIds = user.devices.map(device => device._id.toString()); // Lấy ID thiết bị cũ
            const newDeviceIds = devices.map(device => device.id); // Lấy ID thiết bị mới

            // Kết hợp các thiết bị cũ và thiết bị mới
            allDeviceIds = [...new Set([...existingDeviceIds, ...newDeviceIds])]; // Dùng Set để loại bỏ các ID trùng
        }

        // Tạo đối tượng người dùng mới với thông tin cập nhật
        const userUpdate = {
            fullName,
            email,
            phone,
            address,
            devices: allDeviceIds.map(id => ({ _id: id })), // Chuyển đổi mảng ID thành mảng các đối tượng có _id
        };

        // Cập nhật người dùng trong cơ sở dữ liệu
        const updatedUser = await User.findByIdAndUpdate(req.params.id, userUpdate, { new: true });

        // Chuyển hướng đến trang chi tiết người dùng
        req.flash("success", "Cập nhật thành công !")
        res.redirect("back")
    } catch (error) {
        console.error(error);
        res.status(500).send("Có lỗi xảy ra.");
    }
};

// [GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await User.findById(req.params.id).populate('devices'); // Giả sử trường 'devices' trong User là một mảng chứa các ObjectId của thiết bị

        if (!user) {
            return res.status(404).send('Không tìm thấy người dùng');
        }

        // Render trang chi tiết người dùng với thông tin người dùng và thiết bị
        res.render('pages/admin/users/detail', {
            pageTitle: "Thông tin tài khoản",
            user: user, // Truyền thông tin người dùng vào view
            devices: user.devices // Truyền danh sách thiết bị của người dùng
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra trong khi lấy thông tin người dùng');
    }
};

// [DELETE] /admin/users/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
    await User.updateOne({
        _id: id
    }, {
        deleted: true
    })
    req.flash("success", "Đã xóa tài khoản")
    res.redirect("back")
}

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    await User.updateOne({
        _id: id
    }, {
        status: status
    })
    req.flash("success", "Cập nhật trạng thái thành công !")
    res.redirect("back")
}