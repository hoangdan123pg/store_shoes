const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // mã hóa (hash) password bằng bcrypt
 
//API xử lý login
router.post('/login', async (req, res) => {
    const { email, password} = req.body;
    console.log("data form fe: ", email, password);
    try {
        const user = await Account.findOne({ email});
        console.log("user", user)
        // check email
        if(!user) {
            return res.status(400).json({ message: 'Email không tồn tại'});
        }
        // check password bằng paspsort-local-mongoose
        user.authenticate(password, (err, authenticatedUser, info) => {
            if (err) return res.status(500).json({ message: 'Lỗi server' });
            if (!authenticatedUser) return res.status(401).json({ message: 'Mật khẩu không chính xác' });

            // Tạo token JWT
            const token = jwt.sign({
                id: authenticatedUser._id,
                role: authenticatedUser.role
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log("tạo token", token)
            // Lưu token vào cookie
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000 // 1h
            });
            console.log("Cookies sau khi set:", req.cookies); // Kiểm tra cookie
            res.status(200).json({ user: authenticatedUser });
        });
    }catch (error) {
        res.status(500).json({ error: 'login-server error' });
    }
})
router.post('/register', async (req, res) =>{
    try {
        const {email, password} = req.body;
        console.log(email, password)

        // Kiểm tra nếu email đã tồn tại
        const existingUser = await Account.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Tạo tài khoản mới với passport-local-mongoose
        const newUser = new Account({ email });
        await Account.register(newUser, password);

        // Sau khi đăng ký, ta cần xác thực lại để tạo token JWT
        newUser.authenticate(password, (err, authenticatedUser, info) => {
            if (err) return res.status(500).json({ message: 'Lỗi server' });
            if (!authenticatedUser) return res.status(401).json({ message: 'Xác thực thất bại' });

            // Tạo token JWT giống như trong login
            const token = jwt.sign(
                { id: authenticatedUser._id, role: authenticatedUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            // Lưu token vào cookie
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000 // 1h
            });

            res.status(201).json({ message: 'Đăng ký thành công', user: authenticatedUser });
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server khi đăng ký' });
    }
})
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server khi đăng xuất' });
    }
});

module.exports = router;