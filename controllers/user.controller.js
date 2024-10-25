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