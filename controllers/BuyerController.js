const jwt = require('jsonwebtoken');
const Buyer = require('../models/BuyerModel.js');
const Product = require('../models/ProductModel.js');
const UserProduct = require('../models/UserProductModel.js/index.js');
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
        const { 
            name, username, mobile, password } = req.body;
        const buyer = await Buyer.findOne({$or: [{username: username}, {mobile: mobile}]});
        if (buyer) {
            return res.status(400).json({message: 'Buyer already exists'});
        }
        const newBuyer = new Buyer({
            name, username, mobile, password
        });
        newBuyer.password = encryption(password);
        const savedBuyer = await newBuyer.save();

        const token = jwt.sign({buyerid: savedBuyer._id}, process.env.SECRET, {
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
        const token = jwt.sign({buyerid: buyer._id}, process.env.SECRET, {
            expiresIn: '3h'
        });
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get All Products
/**
 *
 * @method GET
 * @link http://localhost:3000/api/buyer/products
 * @returns products
 */

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get Product By Id
/**
 * 
 * @method GET
 * @link http://localhost:3000/api/buyer/products/:id
 * @returns product
 */

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Search Products
/**
 * 
 * @method GET
 * @link http://localhost:3000/api/buyer/products/search/:name
 * @returns products
 */

exports.searchProducts = async (req, res) => {
    try {
        const { name } = req.params;
        const products = await Product
            .find({$or : [{name: {$regex: name, $options: 'i'}}, {category: {$regex: name, $options: 'i'}}]});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// add to cart
/**
 * 
 * @method POST
 * @link http://localhost:3000/api/buyer/cart
 * @returns cart
 */

exports.addToCart = async (req, res) => {
    try {
        const { productid, quantity } = req.body;
        const product = await Product.findById(productid).select('name price');
        if (!product) {
            return res.status(400).json({message: 'Product does not exist'});
        }
        const newObject = new UserProduct({
            productid, quantity, name: product.name, price: product.price
        });
        const savedObject = await newObject.save();
        await Buyer.findByIdAndUpdate(req.buyerid, {$addToSet: {carts: savedObject._id}});
        res.status(200).json(savedObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get cart
/**
 * 
 * @method GET
 * @link http://localhost:3000/api/buyer/cart
 * @returns cart
 */

exports.getCart = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.buyerid)
            .select('carts').populate('carts');
        res.status(200).json(buyer.carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete product from cart
/**
 * 
 * @method DELETE
 * @link http://localhost:3000/api/buyer/cart/:id
 * @returns cart
 */

exports.deleteProductFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const buyer = await Buyer.findById(req.buyerid);
        buyer.carts.pull(id);
        await buyer.save();
        await UserProduct.findByIdAndDelete(id);
        res.status(200).json({message: 'Product deleted from cart'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update product quantity in cart
/**
 * 
 * @method PUT
 * @link http://localhost:3000/api/buyer/cart/:id
 * @returns cart
 */

exports.updateProductQuantityInCart = async (req, res) => {
    try {
        const { id } = req.params, { quantity } = req.body;
        const userProduct = await UserProduct.findByIdAndUpdate(id, {
            $set : {quantity : quantity}
        });
        res.status(200).json(userProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// clear cart
/**
 * 
 * @method DELETE
 * @link http://localhost:3000/api/buyer/cart
 * @returns cart
 */

exports.clearCart = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.Buyer.buyerid);
        for (let i = 0; i < buyer.carts.length; i++)
            await UserProduct.findByIdAndDelete(buyer.carts[i]);
        buyer.carts = [];
        await buyer.save();
        res.status(200).json({message: 'Cart cleared'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Buyer update profile
/**
 * 
 * @method PUT
 * @link http://localhost:3000/api/buyer/profile
 * @returns buyer
 */

exports.updateProfile = async (req, res) => {
    try {
        const { name, username, mobile } = req.body;
        const buyer = await Buyer.findByIdAndUpdate(req.Buyer._id, {
            $set : {username, name, mobile}
        });
        res.status(200).json(buyer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
