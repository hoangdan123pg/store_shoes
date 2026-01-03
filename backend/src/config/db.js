require('dotenv').config();
const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.URL}${process.env.DBNAME}`);
        console.log("Connected to mongoDB");
    } catch (error) {
        console.log("❌ Connect Db error: ", error.message);
    }
}

module.exports = connectDb;

// //Ket noi den db
// const mongoose = require('mongoose');
// mongoose
// .connect(`${process.env.URL}${process.env.DBNAME}`)
// .then(()=> console.log("Connected to mongoDB"))
// .catch(err => console.log("COnnect error"));