const mongoose = require("mongoose");
//Schemma
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            size: {
                type: Number,
                required: true
            },
            // color: {
            //     type: String,
            //     required: true
            // }
        }
    ],
}, {timestamps: true});

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart