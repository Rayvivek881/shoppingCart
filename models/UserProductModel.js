var mongoose = require('mongoose');
var UserProduct = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    quantity: {
        type: Number,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model('UserProduct', UserProduct);