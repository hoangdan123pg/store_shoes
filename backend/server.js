require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const upload = require('./src/middleware/upload');
// Kết nối database
connectDB();

//tạo server 
const app = express();

//middle ware
app.use(express.json());
app.use(cookieParser()); // sử dụng cookie parser 
app.use(cors({
    credentials: true, // cho phép cookie trên client
    origin: 'http://localhost:3000' // React fornt-end
}))
app.use('/uploads', express.static('uploads'));
// Middleware cho thư mục chứa ảnh
// Import Passport sau khi app đã được khởi tạo
require('./src/config/passport');

//Import router
const authRouter = require('./src/routes/authRoutes');
const userRouter = require('./src/routes/userRouter');
const adminRouter = require('./src/routes/adminRouter');
const publicRouter = require('./src/routes/publicRouter');
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/', publicRouter);
//khai báo thông tin server
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
// chạy server
app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);

})