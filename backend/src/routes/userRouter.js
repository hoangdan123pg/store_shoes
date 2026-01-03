const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); // Không cần { }

const Account = require('../models/Account');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order')
// Lấy thông tin cá nhân
router.get('/my-account', verifyToken, async (req, res) => {
    try {
        console.log("profile: ", req.user);
        const user = await Account.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// add To Cart
// change quantity
// remove from cart
// submit cart -> lưu vào database order
router.post('/add-to-cart', verifyToken, async (req, res) => {
    //console.log("hello")
    const user = req.user;
    // console.log("user:  ",user.id)
    const quantity = req.body.quantity;
    const productId = req.body.id;
    const size = req.body.size;
    // console.log("data", quantity, productId, size);
    try {
        // Tim gio hang theo _id
        const cart = await Cart.findOne({ user: user.id });
        // console.log("cart: ", cart)
        if (!cart) {
            //console.log("step1")
            const newCart = new Cart({ user: user.id });
            await newCart.save();
            cart = newCart;
            // console.log("cart: ", cart)
        }
        // Tim san pham theo _id
        const product = await Product.findById(productId);
        // console.log("product: ", product)
        if (!product) return res.status(404).json({ message: "Product not found" });
        // Tim san pham da co trong gio hang
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity: quantity, size: size });
        }
        await cart.save();
        res.status(200).json({ message: "Product added to cart successfully" });
    } catch(error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})
// api list cart
router.get('/cart', verifyToken, async (req, res) => {
    const user = req.user;
    try {
        const cart = await Cart.findOne({ user: user.id }).populate({
            path: 'items.product',
            select: 'name image price discord'
        });
        console.log("cart", cart)
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})
// api change quality trong cart
router.put('/update-quantity', verifyToken, async (req, res) => {
    // console.log("hello")
    const user = req.user;
    const productId = req.body.productId;
    const type = req.body.type;
    // console.log("data from api: ", type, productId)
    try {
        const cart = await Cart.findOne({ user: user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item not found in cart" });
        if(type === "increase") item.quantity++;
        if(type === "decrease") item.quantity--;
        await cart.save();
        res.status(200).json({ message: "Quantity changed successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }
})
// api xoa item trong cart
router.delete('/remove-item/:id', verifyToken, async (req, res) => {
    console.log("hello");
    const user = req.user;
    const productId = req.params.id;  // Lấy từ query thay vì body
    console.log("data from api: ", user);
    console.log("data from api: ", productId);

    try {
        const cart = await Cart.findOne({ user: user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post('/submit-order', verifyToken, async (req, res) => {
    console.log("hello")
    try {
        const user = req.user; // Lấy user từ token
        console.log("user: ", user.id)
        const { items, totalPrice, shippingAddress, paymentMethod } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng không được trống!" });
        }

        if (!shippingAddress || !shippingAddress.location || !shippingAddress.phone) {
            return res.status(400).json({ message: "Địa chỉ giao hàng không hợp lệ!" });
        }

        if (!['cod', 'credit_card', 'paypal'].includes(paymentMethod)) {
            return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ!" });
        }
        // Tạo order mới
        const newOrder = new Order({
            user: user.id,
            items,
            totalPrice,
            shippingAddress,
            paymentMethod,
            status: "pending",
            paymentStatus: "pending"
        });

        // Lưu vào database
        await newOrder.save();
        res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server khi xử lý đơn hàng!" });
    }
});

// lấy danh sách order
router.get('/orders', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).populate('items.product', 'name price').populate('user', 'name');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

  // router add review
  router.post('/products/review/:productId', verifyToken, async (req, res) => {
    console.log("hello")
    try {
        const { productId } = req.params; // Lấy productId từ params
        const { rate, comment } = req.body; // Nhận đúng dữ liệu từ frontend
        console.log("data from api: ", productId, rate, comment);
        const userId = req.user.id
        console.log("user from api: ",userId);
        const product = await Product.findById(productId);
        // console.log("Product:", product);
 
         if (!product) return res.status(404).json({ message: "Product not found" });
 
         // Kiểm tra xem useSr đã đánh giá chưa
         const existingRateIndex = product.rate.findIndex(r => r._id.toString() === userId);
         if (existingRateIndex !== -1) {
             // Nếu đã đánh giá thì cập nhật lại số sao
             product.rate[existingRateIndex].rate = rate;
         } else {
             // Nếu chưa có thì thêm mới
             product.rate.push({ user_id: userId, rate });
         }
 
         // Thêm bình luận vào danh sách
         product.comment.push({ user_id: userId, comment });
 
         await product.save();
 
         res.status(200).json({ message: "Review added successfully" });
     } catch (error) {
         console.error("Lỗi khi thêm review:", error);
         res.status(500).json({ message: "Internal Server Error" });
     }
 
});
module.exports = router;
