// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    res.render("pages/admin/dashboard/index.pug", {
        pageTitle: "Trang tổng quan | Admin"
    })
}