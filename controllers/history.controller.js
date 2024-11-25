const GasHistory = require("../models/gasHistory.model");
const paginationHelper = require("../helpers/pagination");

// [GET] /history
module.exports.index = async (req, res) => {
    try {
        const userEmail = res.locals.user.email;
        // console.log(userEmail);
        if (!userEmail) {
            req.flash("error", "Bạn cần đăng nhập để xem lịch sử");
            return res.redirect("/user/login");
        }

        let find = {
            userEmail: userEmail
        }

        // Pagination
        const countRecord = await GasHistory.countDocuments(find)
        let objectPagination = paginationHelper({
            currentPage: 1,
            limitItems: 4
        }, req.query, countRecord)

        // Lấy dữ liệu từ database
        const gasHistory = await GasHistory
            .find(find)
            .skip(objectPagination.skip)
            .limit(objectPagination.limitItems)
    
        res.render("pages/history/history.pug", { 
            gasHistory: gasHistory,
            pagination: objectPagination,
            
        });
    } catch (error) {
        console.error("Error in fetching gas history:", error.message);
        req.flash("error", "Không thể lấy dữ liệu lịch sử");
        res.redirect("/dashboard");
    }
};
