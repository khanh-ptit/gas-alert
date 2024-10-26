const User = require("../models/user.model")
const md5 = require("md5")

// [GET] /user/login
module.exports.login = (req, res) => {
    res.render("pages/user/login.pug")
}

// [GET] /user/register
module.exports.register = (req, res) => {
    res.render("pages/user/register.pug")
}

// [GET] /user/forgot-password
module.exports.forgotPassword = (req, res) => {
    res.render("pages/user/forgot-password.pug")
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        // Kiểm tra nếu email đã tồn tại
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        });
        if (existEmail) {
            req.flash("error", "Email đã tồn tại. Vui lòng chọn email khác!")
            res.redirect("back")
            return
        }

        // Kiểm tra và mã hóa mật khẩu
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            req.flash("error", "Vui lòng nhập mật khẩu!")
            res.redirect("back")
            return
        }

        // Tạo người dùng mới
        const newUser = new User(req.body);
        // console.log(newUser);
        await newUser.save();

        // Chuyển hướng sau khi đăng ký thành công
        req.flash("success", "Đăng ký thành công !")
        res.redirect("/user/login");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("An error occurred while registering.");
    }
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({
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
    res.cookie("token", user.token)
    res.locals.user = user
    req.flash("success", "Đăng nhập thành công !")
    res.redirect("/dashboard")
}

// [GET] /user/logout
module.exports.logOut = (req, res) => {
    res.clearCookie("token")
    req.flash("success", "Đăng xuất thành công !")
    res.redirect("/user/login")
}