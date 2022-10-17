const jwt = require('jsonwebtoken');
const Buyer = require('../models/Buyer.js');
const Product = require('../models/Product.js');
const encryption = require('../middlewares/encryption.js');

// Buyer Sign Up
/**
 * 
 * @method POST 
 * @link http://localhost:3000/api/buyer/signup
 * @returns token
 */
exports.buyerSignUp = async (req, res) => {
    try {
        const { name, username, mobile, password } = req.body;
        const buyer = await Buyer.findOne({$or: [{username: username}, {mobile: mobile}]});
        if (buyer) {
            return res.status(400).json({message: 'Buyer already exists'});
        }
        const newBuyer = new Buyer({
            name, username, mobile, password
        });
        newBuyer.password = encryption(password);
        const savedBuyer = await newBuyer.save();

        const token = jwt.sign({id: savedBuyer._id}, process.env.SECRET, {
            expiresIn: '3h'
        });
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Buyer Sign In
/**
 * 
 * @method POST
 * @link http://localhost:3000/api/buyer/signin
 * @returns token
 */

exports.buyerSignIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const buyer = await Buyer.findOne({username: username});
        if (!buyer) {
            return res.status(400).json({message: 'Buyer does not exist'});
        }
        if (buyer.password !== encryption(password)) {
            return res.status(400).json({message: 'Invalid Password'});
        }
        const token = jwt.sign({id: buyer._id}, process.env.SECRET, {
            expiresIn: '3h'
        });
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}