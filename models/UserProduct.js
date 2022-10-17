var mongoose = require('mongoose');
var UserProduct = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model('UserProduct', UserProduct);