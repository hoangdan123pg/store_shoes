const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const accountShema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    avatar: {
        type: String
    },
    addresses: [{
        location: {
            type: String,
        },
        phone: {
            type: String
        },
        isDefault: { 
            type: Boolean, 
            default: false 
        }
    }],
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cart'
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]
}, {timestamps: true}); // tự động thêm trường createdAt, updatedAt

// tao passport-local-mongoose
accountShema.plugin(passportLocalMongoose, {
    usernameField: 'email'
})
// Tham chieu toi db
const Account = mongoose.model('Account', accountShema)
module.exports = Account;
/**
 
async function seedAccount() {
    try {
        // Thêm tài khoản User
        await Account.register(
            { email: 'user01@gmail.com', role: 'user', name: 'User 01' },
            '123' // Mật khẩu ở đây
        );
        
        // Thêm tài khoản Admin
        await Account.register(
            { email: 'admin@gmail.com', role: 'admin', name: 'Admin 01' },
            'admin123' // Mật khẩu admin
        );
        
        console.log('Thêm tài khoản thành công');
        mongoose.connection.close();
    } catch (err) {
        console.log(err);
        mongoose.connection.close();
    }
}
seedAccount();
*/
