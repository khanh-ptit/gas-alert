const prefixAdmin = "/admin"
const dashboardRoutes = require("./dashboard.route")
const userRoutes = require("./user.route")

module.exports = (app) => {
    app.use(prefixAdmin + "/dashboard", dashboardRoutes)
    app.use(prefixAdmin + "/users", userRoutes)
};
