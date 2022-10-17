// order chema
const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    UserProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProduct'
    }],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    status: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model('Order', OrderSchema);
