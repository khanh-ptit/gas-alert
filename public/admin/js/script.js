// Button status
const buttonsStatus = document.querySelectorAll("[button-status]")
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href)
    // console.log(url)
    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status")
            console.log(status)
            if (status) {
                url.searchParams.set("status", status)
            } else {
                url.searchParams.delete("status")
            }
            console.log(url.href)
            window.location.href = url.href // Chuyển hướng sang trang khác
        })
    })
}

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

// Form Search
const formSearch = document.querySelector("#form-search")
let url = new URL(window.location.href)
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        console.log(keyword)
        if (keyword) {
            url.searchParams.set("keyword", keyword)
        } else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

// Sort
const sort = document.querySelector("[sort]");
console.log(sort)
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select]");
    const btnClear = sort.querySelector("[sort-clear]");

    console.log(sortSelect, btnClear)

    // Set the selected option based on URL parameters
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if (sortKey && sortValue) {
        const selectedValue = `${sortKey}-${sortValue}`;
        console.log(selectedValue);

        // Cách 2: Lấy option với giá trị tương ứng và chọn nó
        const selected = sortSelect.querySelector(`option[value='${selectedValue}']`);
        if (selected) {
            selected.selected = true; // Ensure the option is selected
        }
    }

    // Handle sort selection change
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            let str = sortSelect.value.split('-');
            let sortKey = str[0];
            let sortValue = str[1];
            console.log(sortKey + " " + sortValue);

            // Update URL parameters with the selected sort option
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);

            window.location.href = url.href;
        });
    }

    // Clear the sort selection
    if (btnClear) {
        btnClear.addEventListener("click", () => {
            url.searchParams.delete("sortKey");
            url.searchParams.delete("sortValue");
            window.location.href = url.href;
        });
    }
}
// End sort

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