// [GET] /history
module.exports.index = (req, res) => {
    // Dữ liệu mẫu cho lịch sử nồng độ khí gas
    const sampleData = [
        { time: '2024-10-25 10:00', level: 120 },
        { time: '2024-10-25 11:00', level: 150 },
        { time: '2024-10-25 12:00', level: 95 },
        { time: '2024-10-25 13:00', level: 110 }
    ];
    res.render("pages/history/history.pug", {
        gasHistory: sampleData
    })
}