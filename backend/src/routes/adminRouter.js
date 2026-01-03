const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const Account = require("../models/Account");
const Product = require('../models/Product');
const Order = require('../models/Order');
const isAdmin = async (req, res, next) => {
  console.log("isAdmin")
  const user = await Account.findById(req.user.id);
  console.log(user)
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};


router.get('/manager-product/:page', verifyToken, isAdmin, async (req, res) => {
  try {
    //const products = await Product.find(); // Lấy tất cả sản phẩm từ database
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;
    
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    
    const products = await Product.find()
    .skip(skip) // Bỏ qua số lượng sản phẩm theo trang
    .limit(limit); // Giới hạn số sản phẩm mỗi trang
    
    // tra lai response
    res.json({
      currentPage: page,
      totalPages,
      totalProducts,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

// Thêm sản phẩm mới
router.post('/manager-product/add-product', verifyToken, upload.array('image', 5), async (req, res) => {
  console.log("hi")
  try {
    // Kiểm tra xem có ảnh được tải lên không
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Vui lòng tải lên ít nhất một hình ảnh!' });
    }
    
    // Lấy danh sách đường dẫn ảnh
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    // Tạo mới sản phẩm
    const newProduct = new Product({
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      size: req.body.size ? JSON.parse(req.body.size) : [],
      color: req.body.color ? JSON.parse(req.body.color) : [],
      description: req.body.description,
      stock: req.body.stock,
      image: imageUrls, // Lưu danh sách URL ảnh
      status: req.body.status || 'active',
      discord: req.body.discord || 0
    });
    
    // Lưu vào database
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Sản phẩm được thêm thành công!', product: savedProduct });
    
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// router order
// Lấy danh sách order
router.get('/manager-orders', verifyToken, isAdmin, async (req, res) => {
  console.log("order")
  try {
      const orders = await Order.find().populate('user', 'email').populate('items.product', 'name');
      res.json(orders);
  } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});


// Cập nhật trạng thái order
router.put('/orders/:id/status', verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }
  
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    order.status = status;
    await order.save();
      res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});


//=====================
// Add these routes to your adminRouter.js file

// Lấy thông tin chi tiết của một sản phẩm
router.get('/manager-product/detail/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật sản phẩm
router.put('/manager-product/update/:id', verifyToken, isAdmin, upload.array('image', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Cập nhật thông tin cơ bản
    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.stock = req.body.stock || product.stock;
    product.status = req.body.status || product.status;
    product.discord = req.body.discord || product.discord;
    
    // Cập nhật size và color (nếu có)
    if (req.body.size) {
      product.size = JSON.parse(req.body.size);
    }
    
    if (req.body.color) {
      product.color = JSON.parse(req.body.color);
    }
    
    // Xử lý cập nhật hình ảnh (nếu có)
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
      
      // Nếu keepOldImages = false, thay thế hoàn toàn
      if (req.body.keepOldImages === 'false') {
        product.image = imageUrls;
      } else {
        // Nếu không, thêm vào hình ảnh hiện có
        product.image = [...product.image, ...imageUrls];
        // Đảm bảo không vượt quá 5 hình
        if (product.image.length > 5) {
          product.image = product.image.slice(0, 5);
        }
      }
    }
    
    // Lưu cập nhật vào database
    const updatedProduct = await product.save();
    res.json({ 
      message: 'Cập nhật sản phẩm thành công', 
      product: updatedProduct 
    });
    
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server!', error: error.message });
  }
});

// Xóa hình ảnh cụ thể của sản phẩm
router.put('/manager-product/remove-image/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    // Xóa hình ảnh từ mảng
    product.image = product.image.filter(img => img !== imageUrl);
    
    await product.save();
    res.json({ 
      message: 'Xóa hình ảnh thành công', 
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa sản phẩm
router.delete('/manager-product/delete/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});
module.exports = router;
