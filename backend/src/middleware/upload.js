const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đường dẫn chính xác đến thư mục `uploads`
const uploadDir = path.join(__dirname, '../../uploads'); // ✅ Trỏ đúng thư mục uploads cùng cấp với server.js

// Kiểm tra nếu thư mục `uploads` chưa tồn tại thì tạo mới
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // ✅ Lưu đúng vị trí
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb(new Error('Chỉ hỗ trợ file hình ảnh (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

module.exports = upload;
