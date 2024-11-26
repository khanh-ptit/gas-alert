// Show success status
document.addEventListener("DOMContentLoaded", function () {
    const showAlert = document.querySelector("[show-alert]");
    // const btnCancel = showAlert.querySelector("span.alert-hidden")
    if (showAlert) {
        const btnCancel = showAlert.querySelector("span.btn-cancel")
        // console.log(btnCancel)
        btnCancel.addEventListener("click", () => {
            showAlert.classList.add("alert-hidden")
        })
        const time = parseInt(showAlert.getAttribute("data-time"));
        setTimeout(() => {
            showAlert.classList.add("alert-hidden");
        }, time);
    }
});
// End show success status

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
// console.log(buttonsPagination)
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href)
    console.log(url.href)
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination")
            console.log(page)
            if (page) {
                url.searchParams.set("page", page)
            } else {
                url.searchParams.delete("page")
            }
            window.location.href = url.href
        })
    })

}
// End pagination

// Upload image
const uploadImages = document.querySelectorAll("[upload-image]");
// console.log(uploadImages)

if (uploadImages.length > 0) {
    uploadImages.forEach(uploadImage => {
        const btnCancel = uploadImage.querySelector(".image-container .button-cancel");
        const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
        const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

        btnCancel.classList.add("hidden")

        if (uploadImageInput && uploadImagePreview && btnCancel) {
            uploadImageInput.addEventListener("change", (e) => {
                const file = e.target.files[0]; // Lấy ra giá trị đầu tiên
                if (file) {
                    uploadImagePreview.src = URL.createObjectURL(file);
                    btnCancel.classList.remove("hidden"); // Hiển thị nút khi có ảnh
                }
            });

            btnCancel.addEventListener("click", () => {
                btnCancel.classList.add("hidden");
                uploadImagePreview.src = ""; // Xóa ảnh preview
                uploadImageInput.value = ""; // Xóa giá trị input
            });

            // Kiểm tra nếu không có file được chọn, ẩn nút hủy
            uploadImageInput.addEventListener("input", () => {
                if (!uploadImageInput.value) {
                    btnCancel.classList.add("hidden");
                }
            });
        }
    })
}
// End upload image