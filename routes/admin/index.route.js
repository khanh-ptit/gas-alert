const prefixAdmin = "/admin"
const dashboardRoutes = require("./dashboard.route")

module.exports = (app) => {
    app.use(prefixAdmin + "/dashboard", dashboardRoutes)
};
