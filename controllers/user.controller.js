const User = require("../models/user.model")
const md5 = require("md5")
const generateHelper = require("../helpers/generate")
const ForgotPassword = require("../models/forgot-password.model")
const sendMailHelper = require("../helpers/sendMail")

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

// [POST] /user/forgot-password
module.exports.forgotPasswordPost = async (req, res) => {
    console.log(req.body)
    const email = req.body.email

    const existEmail = await User.findOne({
        email: email,
        deleted: false
    })

    if (!existEmail) {
        req.flash("error", "Email không tồn tại hoặc chưa được đăng ký!")
        res.redirect("back")
        return
    }

    // Bước 1: Tạo otp rồi lưu bản ghi đó vào collection forgot-password
    const otp = generateHelper.generateRandomNumber(8)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 180 * 1000)
    }
    const newForgotPassword = new ForgotPassword(objectForgotPassword)
    await newForgotPassword.save()

    // Bước 2: Gửi OTP về mail
    const subject = `Mã xác thực OTP kích hoạt tài khoản`
    const html = `
         Mã OTP kích hoạt tài khoản là <b>${otp}</b>. Lưu ý không được chia sẻ mã này. Thời hạn sử dụng là 3 phút.
     `
    sendMailHelper.sendMail(email.toString(), subject, html)
    res.redirect(`/user/otp-password?email=${email}`)
}

// [GET] /user/otp-password
module.exports.otpPassword = (req, res) => {
    const email = req.query.email
    res.render("pages/user/otp-password", {
        email: email
    })
}

// [POST] /user/otp-password
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp
    const checkForgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if (!checkForgotPassword) {
        req.flash("error", "OTP không hợp lệ!")
        res.redirect("back")
        return
    }

    const user = await User.findOne({
        email: email,
        deleted: false
    })
    res.cookie("token", user.token)
    res.redirect("/user/reset-password")
}

// [GET] /user/reset-password
module.exports.resetPassword = (req, res) => {
    res.render("pages/user/reset-password")
}

// [POST] /user/reset-password
module.exports.resetPasswordPost = async (req, res) => {
    const token = req.cookies.token
    const password = md5(req.body.password)
    const user = await User.findOne({
        token: token,
        deleted: false
    })
    if (user.password == password) {
        req.flash("error", "Mật khẩu mới không được trùng với mật khẩu cũ!")
        res.redirect("back")
        return
    }

    await User.updateOne({
        token: token
    }, {
        password: password
    })

    res.clearCookie("token")
    req.flash("success", "Cập nhật mật khẩu thành công. Vui lòng đăng nhập để tiếp tục")
    res.redirect("/user/login")
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
    req.session.user = {
        email: user.email,

    };
    req.session.save((err) => {
        if (err) {
            console.error("Lỗi khi lưu session:", err);
        } else {
            console.log("Session saved:", req.session);
            // req.flash("success", "Đăng nhập thành công!");
            // res.redirect("/dashboard");
        }
    });    
    req.flash("success", "Đăng nhập thành công !")
    res.redirect("/dashboard")
}

// [GET] /user/logout
module.exports.logOut = (req, res) => {
    res.clearCookie("token")
    req.flash("success", "Đăng xuất thành công !")
    res.redirect("/user/login")
}

// [GET] /user/info
module.exports.info = (req, res) => {
    const user = res.locals.user
    const createdAt = new Date(user.createdAt)
    
    // Extract day, month, and year as numbers
    const day = createdAt.getDate()       // Day of the month (1-31)
    const month = createdAt.getMonth() + 1 // Month (0-11), so add 1 to get 1-12
    const year = createdAt.getFullYear()   // Full year (e.g., 2023)

    res.render("pages/user/info.pug", {
        user: user,
        day: day,
        month: month,
        year: year,
        pageTitle: "Thông tin tài khoản"
    })
}

// [GET] /user/edit
module.exports.edit = (req, res) => {
    const user = res.locals.user
    res.render("pages/user/edit.pug", {
        user: user,
        pageTitle: "Chỉnh sửa tài khoản"
    })
}