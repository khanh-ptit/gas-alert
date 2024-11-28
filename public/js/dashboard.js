document.addEventListener('DOMContentLoaded', function () {
    // Lấy phần tử công tắc và trạng thái
    const manualSwitch = document.getElementById("manualSwitch");
    const switchStatus = document.getElementById("switchStatus");
    const slider = document.querySelector('.slider');

    console.log(manualSwitch.type);  // Kỳ vọng: "checkbox"
    console.log(switchStatus.textContent);  // Kỳ vọng: "Tắt"

    if (!manualSwitch || !switchStatus || !slider) {
        console.error("Không tìm thấy phần tử cần thiết trong DOM.");
        return;
    }

    console.log("Phần tử công tắc và trạng thái đã sẵn sàng:", manualSwitch, switchStatus);

    // Thêm sự kiện change vào input
    manualSwitch.addEventListener("change", () => {
        const isOn = manualSwitch.checked;  // Kiểm tra trạng thái bật/tắt
        switchStatus.textContent = `Trạng thái: ${isOn ? "Bật" : "Tắt"}`;  // Cập nhật trạng thái

        // Cập nhật giao diện khi bật/tắt
        if (isOn) {
            // Khi bật công tắc
            slider.style.backgroundColor = '#007bff';  // Màu xanh cho công tắc bật
            slider.querySelector('::before').style.transform = 'translateX(26px)';  // Đổi vị trí "kép"
        } else {
            // Khi tắt công tắc
            slider.style.backgroundColor = '#ccc';  // Màu xám cho công tắc tắt
            slider.querySelector('::before').style.transform = 'translateX(0)';  // Đặt về vị trí ban đầu
        }

        // Log trạng thái thay đổi
        if (isOn) {
            console.log("Hệ thống được kích hoạt thủ công.");
        } else {
            console.log("Hệ thống được tắt thủ công.");
        }
    });

    // Thêm sự kiện click vào slider (nếu muốn bắt sự kiện click trên slider)
    slider.addEventListener('click', () => {
        const isOn = manualSwitch.checked;
        console.log(`Trạng thái: ${isOn ? "Bật" : "Tắt"}`);
    });
    

    // Biểu đồ hiển thị nồng độ khí gas theo thời gian
    const ctxLineChart = document.getElementById('gasLevelChart').getContext('2d');
    const gasLevelChart = new Chart(ctxLineChart, {
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
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Nồng Độ (ppm)' },
                },
                x: {
                    title: { display: true, text: 'Thời Gian' },
                },
            },
        },
    });

    // Vẽ đồng hồ đo khí gas
    const canvasGauge = document.getElementById('gasGauge');
    const ctxGauge = canvasGauge.getContext('2d');
    const gasLevelValue = document.getElementById('gasLevelValue');

    function drawGauge(value) {
        const max = 1000; // Giả định giá trị tối đa
        const min = 0;
        const angleStart = Math.PI; // Góc bắt đầu (180 độ)
        const angleEnd = 2 * Math.PI; // Góc kết thúc (360 độ)

        const radius = canvasGauge.width / 2 - 10;
        const centerX = canvasGauge.width / 2;
        const centerY = canvasGauge.height / 2;

        ctxGauge.clearRect(0, 0, canvasGauge.width, canvasGauge.height);

        // Vẽ nền đồng hồ
        ctxGauge.beginPath();
        ctxGauge.arc(centerX, centerY, radius, angleStart, angleEnd);
        ctxGauge.lineWidth = 15;
        ctxGauge.strokeStyle = '#eaeaea';
        ctxGauge.stroke();

        // Vẽ giá trị hiện tại
        const angleValue = angleStart + (value - min) / (max - min) * Math.PI;

        ctxGauge.beginPath();
        ctxGauge.arc(centerX, centerY, radius, angleStart, angleValue);
        ctxGauge.lineWidth = 15;
        ctxGauge.strokeStyle = value > threshold ? '#ff4d4d' : '#4caf50'; // Màu đỏ nếu vượt ngưỡng
        ctxGauge.stroke();

        // Vẽ kim đồng hồ
        ctxGauge.beginPath();
        ctxGauge.moveTo(centerX, centerY);
        ctxGauge.lineTo(
            centerX + radius * Math.cos(angleValue),
            centerY + radius * Math.sin(angleValue)
        );
        ctxGauge.lineWidth = 5;
        ctxGauge.strokeStyle = '#000';
        ctxGauge.stroke();

        // Vẽ tâm đồng hồ
        ctxGauge.beginPath();
        ctxGauge.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctxGauge.fillStyle = '#000';
        ctxGauge.fill();
    }

    const socket = io(); // Kết nối tới server qua Socket.IO
    let threshold = 600; // Giá trị ngưỡng mặc định

    // DOM Elements
    const thresholdSlider = document.getElementById('thresholdSlider');
    const thresholdValue = document.getElementById('thresholdValue');
    const alertText = document.getElementById('alertText');
    const alertStatus = document.getElementById('alertStatus');
    const connectionLed = document.getElementById('connectionLed');
    const alertLed = document.getElementById('alertLed');

    // Lầy ra giá trị ngưỡng
    fetch('/dashboard/api/threshold')
    .then((response) => {
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        threshold = data.threshold || 600;
        updateThresholdDisplay(threshold);
    })
    .catch((error) => console.error('Error fetching threshold:', error));


    // Lắng nghe dữ liệu thời gian thực từ server
    socket.on('gasData', (data) => {
        const gasLevel = data.gas_level;
        // console.log('Real-time data:', gasLevel);

        updateDashboard(gasLevel, threshold);
        updateChart(gasLevel);
        drawGauge(gasLevel); // Cập nhật đồng hồ
    });

    // Nếu mất kết nối
    socket.on('disconnect', () => {
        connectionLed.classList.remove('green');
        connectionLed.classList.add('red');
        alertStatus.textContent = 'Mất kết nối';
        alertStatus.classList.add('text-muted');
    });

    // Cập nhật ngưỡng hiển thị
    thresholdSlider.addEventListener('input', function () {
        threshold = parseInt(this.value, 10);
        updateThresholdDisplay(threshold);
    });

    // Gửi ngưỡng mới lên server
    thresholdSlider.addEventListener('change', function () {
        // console.log(thresholdSlider)
        fetch('/dashboard/api/threshold', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newThreshold: threshold }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to update threshold');
                console.log('Threshold updated on server');
            })
            .catch((error) => console.error('Error updating threshold:', error));
    });
       
    // Hàm: Cập nhật giao diện Dashboard
    function updateDashboard(gasLevel, threshold) {
        gasLevelValue.textContent = `${gasLevel} ppm`;

        if (gasLevel > threshold) {
            alertStatus.textContent = 'Nồng độ vượt ngưỡng!';
            alertStatus.classList.remove('text-muted');
            alertStatus.classList.add('text-danger');
            alertLed.classList.remove('hidden');

            alertText.classList.remove('hidden');
            alertText.textContent = `Cảnh báo: Nồng độ khí gas vượt ngưỡng ${threshold} ppm!`;
        } else {
            alertStatus.textContent = 'Không có cảnh báo';
            alertStatus.classList.remove('text-danger');
            alertStatus.classList.add('text-muted');
            alertLed.classList.add('hidden');

            alertText.classList.add('hidden');
        }

        connectionLed.classList.remove('red');
        connectionLed.classList.add('green');
    }

    // Hàm: Cập nhật biểu đồ
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

    // Hàm: Cập nhật hiển thị ngưỡng
    function updateThresholdDisplay(value) {
        thresholdValue.textContent = `Ngưỡng Cảnh Báo: ${value} ppm`;
    }

    // Fallback: Lấy dữ liệu định kỳ nếu Socket.IO không hoạt động
    setInterval(() => {
        fetch('/api/gas-data')
            .then((response) => response.json())
            .then((data) => {
                // console.log('Fallback data:', data);
                updateDashboard(data.gas_level, threshold);
                updateChart(data.gas_level);
                drawGauge(data.gas_level); // Cập nhật đồng hồ
            })
            .catch((error) => console.error('Error fetching fallback data:', error));
    }, 5000);
});
