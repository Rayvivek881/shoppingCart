// USER MODEL
// ==============================
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
});

module.exports = mongoose.model('User', userSchema);
