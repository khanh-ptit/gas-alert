document.addEventListener("DOMContentLoaded", () => {
    const filterForm = document.querySelector("form[action='/history']");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    // Đảm bảo ngày bắt đầu không lớn hơn ngày kết thúc
    const validateDates = () => {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate && startDate > endDate) {
            alert("Thời gian bắt đầu không được lớn hơn thời gian kết thúc!");
            return false;
        }
        return true;
    };

    // Xử lý sự kiện submit
    filterForm.addEventListener("submit", (e) => {
        if (!validateDates()) {
            e.preventDefault(); // Ngăn form gửi nếu không hợp lệ
        }
    });
});
