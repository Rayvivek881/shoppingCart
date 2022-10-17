// buyer shemea
var mongoose = require('mongoose');
var BuyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    carts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProduct'
    }],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
}, { timestamps: true });
module.exports = mongoose.model('Buyer', BuyerSchema);