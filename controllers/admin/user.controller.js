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

        res.render("pages/admin/users/edit.pug", {
            pageTitle: "Chỉnh sửa người dùng",
            user: user,
            devices: devices // Truyền danh sách thiết bị vào view
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Có lỗi xảy ra khi tải dữ liệu");
    }
};
