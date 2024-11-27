const prefixAdmin = "/admin"
const dashboardRoutes = require("./dashboard.route")
const userRoutes = require("./user.route")
const deviceRoutes = require("./device.route")
const authRoutes = require("./auth.route")
const authMiddleware = require("../../middlewares/auth.middleware")

module.exports = (app) => {
    app.get("/admin", (req, res) => {
        res.redirect("/admin/dashboard")
    })
    
    app.use(prefixAdmin + "/dashboard", authMiddleware.requireAuthAdmin, dashboardRoutes)
    app.use(prefixAdmin + "/users", authMiddleware.requireAuthAdmin, userRoutes)
    app.use(prefixAdmin + "/devices", authMiddleware.requireAuthAdmin, deviceRoutes)
    app.use(prefixAdmin + "/auth", authRoutes)
};
