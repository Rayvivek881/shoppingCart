const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller.js');
const Product = require('../models/Product.js');
const encryption = require('../middlewares/encryption.js');

// Seller Sign Up
/**
 * 
 * @method POST
 * @link http://localhost:3000/api/seller/signup
 * @returns token
 */

exports.sellerSignUp = async (req, res) => {
    try {
        const { name, username, mobile, password } = req.body;
        const seller = await Seller.findOne({$or: [{username: username}, {mobile: mobile}]});

        if (seller) {
            return res.status(400).json({message: 'Seller already exists'});
        }
        const newSeller = new Seller({
            name, username, mobile, password
        });
        newSeller.password = encryption(password);
        const savedSeller = await newSeller.save();

        const token = jwt.sign({id: savedSeller._id}, process.env.SECRET, {
            expiresIn: '3h'
        });
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Seller Sign In
/**
 * 
 * @method POST
 * @link http://localhost:3000/api/seller/signin
 * @returns token
 */

exports.sellerSignIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const seller = await Seller.findOne({username: username});
        if (!seller) {
            return res.status(400).json({message: 'Seller does not exist'});
        }
        if (seller.password !== encryption(password)) {
            return res.status(400).json({message: 'Invalid Password'});
        }
        const token = jwt.sign({id: seller._id}, process.env.SECRET, {
            expiresIn: '3h'
        });
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}