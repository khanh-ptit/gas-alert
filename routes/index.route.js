const userRoutes = require("./user.route");
const historyRoutes = require("./history.route");
const dashboardRoutes = require("./dashboard.route");
const deviceManagementRoutes = require("./device-management.route")

module.exports = (app) => {
    app.use("/user", userRoutes);
    app.use("/history", historyRoutes);
    app.use("/dashboard", dashboardRoutes);
    app.use("/device-management", deviceManagementRoutes)

    app.get("/", (req, res) => {
        res.redirect("/dashboard");
    });
};
