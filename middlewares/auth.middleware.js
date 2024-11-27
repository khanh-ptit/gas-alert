const User = require("../models/user.model")
const Account = require("../models/account.model")

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

module.exports.requireAuthAdmin = async (req, res, next) => {
    if (!req.cookies.tokenAdmin) {
        req.flash("error", "Bạn cần đăng nhập đã !")
        res.redirect(`/admin/auth/login`)
    } else {
        // console.log(req.cookies.token)
        const user = await Account.findOne({
            tokenAdmin: req.cookies.tokenAdmin,
            deleted: false
        }).select("-password")
        // console.log(user, req.cookies.tokenAdmin)
        if (!user) {
            res.redirect(`/admin/auth/login`)
        } else {
            res.locals.account = user
            next()
        }
    }
}