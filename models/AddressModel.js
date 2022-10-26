const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    mobile : {
        type: String,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model('Address', AddressSchema);