const express = require('express')
const app = express()
const port = 8888

const route = require("./routes/index.route")

// Cấu hình view engine Pug
app.set("views", "./views")
app.set("view engine", "pug")

// Middleware để sử dụng các tệp tĩnh
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

route(app)


// app.get('/', (req, res) => {
//     res.render("pages/dashboard.pug")
// })

// app.get('/login', (req, res) => {
//     res.render("pages/login.pug")
// })

// app.get('/history', (req, res) => {
//     // Dữ liệu mẫu cho lịch sử nồng độ khí gas
//     const sampleData = [
//         { time: '2024-10-25 10:00', level: 120 },
//         { time: '2024-10-25 11:00', level: 150 },
//         { time: '2024-10-25 12:00', level: 95 },
//         { time: '2024-10-25 13:00', level: 110 }
//     ];

//     // Render trang history và truyền dữ liệu mẫu vào
//     res.render('pages/history', { gasHistory: sampleData });
// });

// app.get('/dashboard', (req, res) => {
//     res.render("pages/dashboard.pug")
// })

// app.get('/register', (req, res) => {
//     res.render("pages/register.pug")
// })

// app.get('/forgot-password', (req, res) => {
//     res.render("pages/forgot-password.pug")
// })


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})