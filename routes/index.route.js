const userRoutes = require("./user.route")
const historyRoutes = require("./history.route")
const dashboardRoutes = require("./dashboard.route")

module.exports = (app) => {
    app.use("/user", userRoutes)
    app.use("/history", historyRoutes)
    app.use("/dashboard", dashboardRoutes)
}