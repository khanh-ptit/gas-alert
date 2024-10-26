const express = require('express');
const methodOverride = require("method-override");
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require("dotenv").config();
const database = require("./config/database");
database.connect();

const app = express();
const port = process.env.PORT || 3000; // Thêm giá trị dự phòng cho cổng

const route = require("./routes/index.route");

// Cấu hình view engine Pug
app.set("views", "./views");
app.set("view engine", "pug");

// Middleware để xử lý dữ liệu từ form và ghi đè phương thức
app.use(express.static('public'));
app.use(methodOverride('_method'));  // Đặt trước express.json() và express.urlencoded()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Flash
app.use(cookieParser('tomcacto'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

// Khởi tạo route
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
