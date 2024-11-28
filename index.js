const express = require('express');
const methodOverride = require("method-override");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const database = require("./config/database");
const gasModel = require("./models/gas.model");
database.connect();

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Khởi tạo WebSocket server
const port = process.env.PORT || 3000;

const route = require("./routes/index.route");
const routeAdmin = require("./routes/admin/index.route");

// Cấu hình view engine Pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Middleware xử lý dữ liệu từ form và ghi đè phương thức
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Flash
app.use(cookieParser('tomcacto'));
app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 ngày
    secret: 'tomcacto',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

// CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Phát dữ liệu real-time qua Socket.IO
setInterval(() => {
    const gasData = gasModel.getGasData();
    io.emit("gasData", gasData); // Phát dữ liệu qua WebSocket
}, 2000);

// API để lấy dữ liệu khí gas (fallback)
app.get("/api/gas-data", (req, res) => {
    const gasData = gasModel.getGasData();
    res.json(gasData);
});

// Truyền io vào middleware để sử dụng trong các controller
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Khởi tạo route
route(app);
routeAdmin(app);

// Lắng nghe sự kiện từ WebSocket
let isSystemActive = true; // Trạng thái hệ thống mặc định là bật

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Xử lý yêu cầu bật/tắt từ client
    socket.on("toggleMode", (status) => {
        isSystemActive = status;
        console.log(`System is now ${isSystemActive ? "active" : "inactive"}`);
    });

    // Gửi dữ liệu real-time nếu hệ thống hoạt động
    setInterval(() => {
        if (isSystemActive) {
            const gasData = gasModel.getGasData();
            socket.emit("gasData", gasData);
        }
    }, 2000);
});

// Lắng nghe server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
