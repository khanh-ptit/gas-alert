const User = require("../models/user.model")

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash("error", "Bạn cần đăng nhập đã !")
        res.redirect(`/user/login`)
    } else {
        // console.log(req.cookies.token)
        const user = await User.findOne({
            token: req.cookies.token,
            deleted: false
        }).select("-password")
        if (!user) {
            res.redirect(`/user/login`)
        } else {
            res.locals.user = user
            next()
        }
    }
}