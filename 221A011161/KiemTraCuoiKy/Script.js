let currentRow = null;
let hinhURL = '';

window.onload = function () {
    let data = JSON.parse(localStorage.getItem('benhNhan')) || [];
    let table = document.querySelector('.Dsbn table');

    // Xóa dữ liệu mẫu nếu có
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    data.forEach(bn => {
        let newRow = table.insertRow(-1);
        newRow.innerHTML = `
            <td>${bn.maBN}</td>
            <td>${bn.hoTen}</td>
            <td>${bn.tuoi}</td>
            <td><img src="${bn.hinhDaiDien}" width="80"></td>
            <td>${bn.gioiTinh}</td>
            <td>${bn.trieuChung}</td>
            <td><button onclick="xoaDong(this)">Xóa</button></td>
            <td><button onclick="suaDong(this)">Sửa</button></td>
        `;
    });
};

// Lắng nghe khi chọn hình
document.getElementById('hinhDaiDien').addEventListener('change', function (e) {
    let file = e.target.files[0];
    if (file) {
        hinhURL = URL.createObjectURL(file); // URL tạm
    } else {
        hinhURL = '';
    }
});

// Xử lý thêm / cập nhật
document.getElementById('btnThem').addEventListener('click', function () {
    let maBN = document.getElementById('maBN').value.trim();
    let hoTen = document.getElementById('hoTen').value.trim();
    let tuoi = document.getElementById('tuoi').value.trim();
    let gioiTinh = document.querySelector('input[name="gioi_tinh"]:checked')?.value || '';
    let trieuChung = document.getElementById('trieuChung').value.trim();

    if (!maBN || !hoTen || !tuoi || !gioiTinh || !trieuChung) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    let table = document.querySelector('.Dsbn table');

    if (document.getElementById('btnThem').innerText === 'Cập nhật') {
        // Nếu sửa mà không chọn ảnh mới thì giữ ảnh cũ
        if (!hinhURL) {
            hinhURL = currentRow.cells[3].querySelector('img').src;
        }

        currentRow.cells[0].innerText = maBN;
        currentRow.cells[1].innerText = hoTen;
        currentRow.cells[2].innerText = tuoi;
        currentRow.cells[3].innerHTML = `<img src="${hinhURL}" width="80">`;
        currentRow.cells[4].innerText = gioiTinh;
        currentRow.cells[5].innerText = trieuChung;

        document.getElementById('btnThem').innerText = 'Thêm bệnh nhân';
        currentRow = null;
        luuLocalStorage();
    } else {
        if (!hinhURL) {
            alert("Vui lòng chọn ảnh đại diện!");
            return;
        }

        let newRow = table.insertRow(-1);
        newRow.innerHTML = `
            <td>${maBN}</td>
            <td>${hoTen}</td>
            <td>${tuoi}</td>
            <td><img src="${hinhURL}" width="80"></td>
            <td>${gioiTinh}</td>
            <td>${trieuChung}</td>
            <td><button onclick="xoaDong(this)">Xóa</button></td>
            <td><button onclick="suaDong(this)">Sửa</button></td>
        `;
        luuLocalStorage();
    }

    resetForm();
});

function xoaDong(button) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        button.parentElement.parentElement.remove();
        luuLocalStorage();
    }
}

function suaDong(button) {
    currentRow = button.parentElement.parentElement;

    document.getElementById('maBN').value = currentRow.cells[0].innerText;
    document.getElementById('hoTen').value = currentRow.cells[1].innerText;
    document.getElementById('tuoi').value = currentRow.cells[2].innerText;
    document.getElementById('trieuChung').value = currentRow.cells[5].innerText;
    document.getElementById('btnThem').innerText = 'Cập nhật';
}

function resetForm() {
    document.getElementById('maBN').value = '';
    document.getElementById('hoTen').value = '';
    document.getElementById('tuoi').value = '';
    document.querySelectorAll('input[name="gioi_tinh"]').forEach(r => r.checked = false);
    document.getElementById('trieuChung').value = '';
    document.getElementById('hinhDaiDien').value = '';
    hinhURL = '';
}

function luuLocalStorage() {
    let table = document.querySelector('.Dsbn table');
    let data = [];

    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        data.push({
            maBN: row.cells[0].innerText,
            hoTen: row.cells[1].innerText,
            tuoi: row.cells[2].innerText,
            hinhDaiDien: row.cells[3].querySelector('img').src,
            gioiTinh: row.cells[4].innerText,
            trieuChung: row.cells[5].innerText
        });
    }

    localStorage.setItem('benhNhan', JSON.stringify(data));
}
