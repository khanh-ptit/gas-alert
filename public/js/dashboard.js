document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('gasLevelChart').getContext('2d');
    const gasLevelChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Nồng Độ Khí Gas (ppm)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nồng Độ (ppm)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Thời Gian'
                    }
                }
            }
        }
    });

    const socket = io(); // Kết nối tới server qua Socket.IO

    // Lắng nghe dữ liệu từ server qua Socket.IO
    socket.on("gasData", (data) => {
        console.log("Real-time data:", data);
        updateDashboard(data);
        updateChart(data.gas_level);
    });

    // Fallback: Lấy dữ liệu qua API nếu Socket.IO không hoạt động
    function fetchGasDataFallback() {
        $.ajax({
            url: '/api/gas-data',
            method: 'GET',
            success: function (data) {
                console.log("Fallback data:", data);
                updateDashboard(data);
                updateChart(data.gas_level);
            },
            error: function (err) {
                console.error("Error fetching fallback data:", err);
            }
        });
    }

    // Cập nhật giao diện Dashboard
    // Cập nhật giao diện Dashboard
    function updateDashboard(data) {
        const gasLevel = data.gas_level; // Lấy giá trị nồng độ khí gas
        $('#gasLevelText').text(`${gasLevel} ppm`); // Hiển thị giá trị nồng độ trên giao diện

        // Hiển thị cảnh báo nếu nồng độ khí gas vượt 600 ppm
        if (gasLevel > 600) {
            $('#alertText')
                .removeClass('hidden') // Bỏ ẩn thẻ cảnh báo
                .text("Cảnh báo: Nồng độ khí gas vượt ngưỡng an toàn!"); // Nội dung cảnh báo
        } else {
            $('#alertText').addClass('hidden'); // Ẩn cảnh báo nếu nồng độ dưới 600 ppm
        }
    }


    // Cập nhật biểu đồ
    function updateChart(newGasLevel) {
        const now = new Date().toLocaleTimeString();
        gasLevelChart.data.labels.push(now);
        gasLevelChart.data.datasets[0].data.push(newGasLevel);

        if (gasLevelChart.data.labels.length > 10) {
            gasLevelChart.data.labels.shift();
            gasLevelChart.data.datasets[0].data.shift();
        }

        gasLevelChart.update();
    }

    // Fallback: Gọi API mỗi 5 giây nếu cần
    setInterval(fetchGasDataFallback, 5000);
});
//////
$(document).ready(function () {
    let threshold = 600; // Giá trị ngưỡng mặc định

    // Kết nối Socket.IO
    const socket = io();

    // Cập nhật giao diện khi nhận dữ liệu
    socket.on("gasData", (data) => {
        const gasLevel = data.gas_level;

        // Cập nhật nồng độ khí gas
        $('#gasLevelText').text(`${gasLevel} ppm`);

        // Kiểm tra và cập nhật đèn cảnh báo
        if (gasLevel > threshold) {
            $('#alertLed').removeClass('hidden').addClass('red');
            $('#alertText')
                .removeClass('hidden')
                .text("Cảnh báo: Nồng độ khí gas vượt ngưỡng!");
        } else {
            $('#alertLed').removeClass('red').addClass('hidden');
            $('#alertText').addClass('hidden');
        }

        // Hiển thị đèn kết nối
        $('#connectionLed').removeClass('red').addClass('green');
    });

    // Nếu mất kết nối
    socket.on("disconnect", () => {
        $('#connectionLed').removeClass('green').addClass('red');
    });

    // Cập nhật ngưỡng cảnh báo khi thay đổi slider
    $('#thresholdSlider').on('input', function () {
        threshold = $(this).val();
        $('#thresholdValue').text(`Ngưỡng Cảnh Báo Hiện Tại: ${threshold} ppm`);
    });

    // Xử lý nút bật/tắt chế độ hoạt động
    $('#toggleModeButton').on('click', function () {
        const isActive = $(this).hasClass('active');
        $(this).toggleClass('active btn-danger btn-primary')
            .text(isActive ? 'Bật Chế Độ Hoạt Động' : 'Tắt Chế Độ Hoạt Động');
        socket.emit('toggleMode', !isActive); // Gửi yêu cầu bật/tắt lên server
    });
});
