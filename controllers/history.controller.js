const GasHistory = require("../models/gasHistory.model");
const paginationHelper = require("../helpers/pagination");

// [GET] /history
module.exports.index = async (req, res) => {
    try {
        const userEmail = res.locals.user.email;
        if (!userEmail) {
            req.flash("error", "Bạn cần đăng nhập để xem lịch sử");
            return res.redirect("/user/login");
        }

        // Xây dựng query
        const { startDate, endDate } = req.query;
        let find = {
            userEmail: userEmail
        };

        // Thêm điều kiện lọc theo thời gian nếu có
        if (startDate || endDate) {
            find.timestamp = {};
            if (startDate) {
                find.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                find.timestamp.$lte = new Date(endDate);
            }
        }

        // Pagination
        const countRecord = await GasHistory.countDocuments(find);
        let objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 4,
            },
            req.query,
            countRecord
        );

        // Lấy dữ liệu từ database
        const gasHistory = await GasHistory.find(find)
            .sort({ timestamp: -1 })
            .skip(objectPagination.skip)
            .limit(objectPagination.limitItems);

        res.render("pages/history/history.pug", {
            gasHistory: gasHistory,
            pagination: objectPagination,
            pageTitle: "Lịch sử",
            startDate: startDate || "",
            endDate: endDate || "",
        });
    } catch (error) {
        console.error("Error in fetching gas history:", error.message);
        req.flash("error", "Không thể lấy dữ liệu lịch sử");
        res.redirect("/dashboard");
    }
};

