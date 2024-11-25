// document.addEventListener('DOMContentLoaded', function () {
//     const ctx = document.getElementById('gasLevelChart').getContext('2d');
//     const gasLevelChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: [],
//             datasets: [{
//                 label: 'Nồng Độ Khí Gas (ppm)',
//                 data: [],
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                 borderWidth: 2,
//                 fill: true,
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: 'Nồng Độ (ppm)'
//                     }
//                 },
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Thời Gian'
//                     }
//                 }
//             }
//         }
//     });

//     const socket = io(); // Kết nối tới server qua Socket.IO

//     // Lắng nghe dữ liệu từ server qua Socket.IO
//     socket.on("gasData", (data) => {
//         console.log("Real-time data:", data);
//         updateDashboard(data);
//         updateChart(data.gas_level);
//     });

//     // Fallback: Lấy dữ liệu qua API nếu Socket.IO không hoạt động
//     function fetchGasDataFallback() {
//         $.ajax({
//             url: '/api/gas-data',
//             method: 'GET',
//             success: function (data) {
//                 console.log("Fallback data:", data);
//                 updateDashboard(data);
//                 updateChart(data.gas_level);
//             },
//             error: function (err) {
//                 console.error("Error fetching fallback data:", err);
//             }
//         });
//     }


//     let threshold = 600; // Giá trị ngưỡng mặc định

//     // Cập nhật giá trị slider
//     const thresholdSlider = document.getElementById('thresholdSlider');
//     const thresholdValue = document.getElementById('thresholdValue');

//     thresholdSlider.addEventListener('input', function () {
//         threshold = parseInt(this.value); // Cập nhật giá trị threshold
//         thresholdValue.textContent = `Ngưỡng Cảnh Báo Hiện Tại: ${threshold} ppm`;
//     });
   
//     // Cập nhật giao diện Dashboard
//     // Cập nhật giao diện Dashboard
//     function updateDashboard(data, threshold) {
//         const gasLevel = data.gas_level; // Lấy giá trị nồng độ khí gas
//         $('#gasLevelText').text(`${gasLevel} ppm`); // Hiển thị giá trị nồng độ trên giao diện

//         // Hiển thị cảnh báo nếu nồng độ khí gas vượt ngưỡng
//         if (gasLevel > threshold) {
//             $('#alertText')
//                 .removeClass('hidden') // Bỏ ẩn thẻ cảnh báo
//                 .text(`Cảnh báo: Nồng độ khí gas vượt ngưỡng ${threshold} ppm!`); // Nội dung cảnh báo
//         } else {
//             $('#alertText').addClass('hidden'); // Ẩn cảnh báo nếu nồng độ dưới threshold
//         }
//     }

//     // Cập nhật biểu đồ
//     function updateChart(newGasLevel) {
//         const now = new Date().toLocaleTimeString();
//         gasLevelChart.data.labels.push(now);
//         gasLevelChart.data.datasets[0].data.push(newGasLevel);

//         if (gasLevelChart.data.labels.length > 10) {
//             gasLevelChart.data.labels.shift();
//             gasLevelChart.data.datasets[0].data.shift();
//         }

//         gasLevelChart.update();
//     }

//     // Fallback: Gọi API mỗi 5 giây nếu cần
//     setInterval(fetchGasDataFallback, 5000);
// });
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
    

    let threshold = 600; // Giá trị ngưỡng mặc định

    // Lấy giá trị ngưỡng từ server khi trang được tải
    fetch('/api/threshold')
        .then(response => response.json())
        .then(data => {
            threshold = data.threshold;
            updateThresholdDisplay(threshold);
        })
        .catch(error => console.error('Error fetching threshold:', error));

    // Lắng nghe dữ liệu từ server qua Socket.IO
    socket.on("gasData", (data) => {
        console.log("Real-time data:", data);
        updateDashboard(data, threshold);
        updateChart(data.gas_level);
    });

    // Fallback: Lấy dữ liệu qua API nếu Socket.IO không hoạt động
    function fetchGasDataFallback() {
        $.ajax({
            url: '/api/gas-data',
            method: 'GET',
            success: function (data) {
                console.log("Fallback data:", data);
                updateDashboard(data, threshold);
                updateChart(data.gas_level);
            },
            error: function (err) {
                console.error("Error fetching fallback data:", err);
            }
        });
    }

    // Cập nhật giá trị slider
    const thresholdSlider = document.getElementById('thresholdSlider');
    const thresholdValue = document.getElementById('thresholdValue');

    thresholdSlider.addEventListener('input', function () {
        threshold = parseInt(this.value); // Cập nhật giá trị threshold
        updateThresholdDisplay(threshold);
    });

    // Gửi ngưỡng mới lên server khi slider thay đổi
    thresholdSlider.addEventListener('change', function () {
        fetch('/api/threshold', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newThreshold: threshold })
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update threshold');
                console.log("Threshold updated on server");
            })
            .catch(error => console.error("Error updating threshold:", error));
    });

    // Cập nhật hiển thị ngưỡng
    function updateThresholdDisplay(value) {
        thresholdValue.textContent = `Ngưỡng Cảnh Báo Hiện Tại: ${value} ppm`;
    }

    // Cập nhật giao diện Dashboard
    function updateDashboard(data, threshold) {
        const gasLevel = data.gas_level; // Lấy giá trị nồng độ khí gas
        $('#gasLevelText').text(`${gasLevel} ppm`); // Hiển thị giá trị nồng độ trên giao diện

        // Hiển thị cảnh báo nếu nồng độ khí gas vượt ngưỡng
        if (gasLevel > threshold) {
            $('#alertText')
                .removeClass('hidden') // Bỏ ẩn thẻ cảnh báo
                // .text(`Cảnh báo: Nồng độ khí gas vượt ngưỡng ${threshold} ppm!`); // Nội dung cảnh báo
        } else {
            $('#alertText').addClass('hidden'); // Ẩn cảnh báo nếu nồng độ dưới threshold
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
        const threshold = parseInt(thresholdSlider.value);

        // Cập nhật trạng thái cảnh báo
        if (gasLevel > threshold) {
            alertStatus.textContent = `Nồng độ vượt ngưỡng!`;
            alertStatus.classList.remove('text-muted');
            alertStatus.classList.add('text-danger');
            alertLed.classList.remove('hidden');
        } else {
            alertStatus.textContent = `Không có cảnh báo`;
            alertStatus.classList.remove('text-danger');
            alertStatus.classList.add('text-muted');
            alertLed.classList.add('hidden');
        }

        // Đèn kết nối
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
    $('#alertText').addClass('hidden');

});
