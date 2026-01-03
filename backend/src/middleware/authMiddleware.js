const jwt = require('jsonwebtoken');


//Middle bảo vệ route
const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    console.log("token verify", token);
    if (!token) {
        // console.log("verifyToken: ƯChua dang nhap");
        return res.status(401).json({ message: 'Chua dang nhap', state: "notLogin" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
       // console.log(" req.user ",decoded) => tra ve _id
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
module.exports = verifyToken;