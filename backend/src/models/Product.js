const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        lowercase: true, // Chuyển tất cả về chữ thường để tránh trùng lặp dữ liệu
        trim: true,
    },
    size: [{
        type: Number, 
        required: true
    }],
    color: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    stock: { // so luong kho
        type: Number,
        required: true,
    },
    image: [{
        type: String, // Url hình ảnh chứa sản phẩm
        required: true
    }],
    status: {
        type: String,
    },
    discord: {
        type: Number,
        default: 0, // Mặc định không giảm giá
        min: 0,
        max: 100, // Giới hạn giảm giá từ 0% - 100%
    },
    rate: [{ 
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, 
        rate: { type: Number, min: 1, max: 5 } 
    }],
    comment: [{ 
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, 
        comment: { type: String }
    }]
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;