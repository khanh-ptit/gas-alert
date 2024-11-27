const Account = require("../../models/account.model")
const md5 = require("md5")

// [GET] /admin/auth/login 
module.exports.login = async (req, res) => {
    if (req.cookies.tokenAdmin) {
        req.flash("error", "Bạn đã đăng nhập rồi !")
        res.redirect(`/admin/dashboard`)
        return
    }
    res.render("pages/admin/auth/login.pug")
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const user = await Account.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email không tồn tại trong hệ thống !")
        res.redirect("back")
        return
    }

    const password = user.password
    if (password != md5(req.body.password)) {
        req.flash("error", "Email hoặc mật khẩu không đúng !")
        res.redirect("back")
        return
    }
    res.cookie("tokenAdmin", user.tokenAdmin)
    res.locals.account = user
    
    req.flash("success", "Đăng nhập thành công !")
    res.redirect("/admin/dashboard")
}

// [GET] /user/logout
module.exports.logOut = (req, res) => {
    res.clearCookie("tokenAdmin")
    req.flash("success", "Đăng xuất thành công !")
    res.redirect("/admin/auth/login")
}