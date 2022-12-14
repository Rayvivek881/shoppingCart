const jwt = require('jsonwebtoken');
const Buyer = require('../models/BuyerModel.js');
const Product = require('../models/ProductModel.js');
const UserProduct = require('../models/UserProductModel.js');
const encryption = require('../middlewares/encryption.js');

/**
 * 
 * @method POST 
 * @link http://localhost:3000/api/buyer/signup
 * @returns token
 */
exports.buyerSignUp = async (req, res) => {
    try {
        const { 
            name, username, mobile, password, zip, address
        } = req.body;
        const buyer = await Buyer.findOne({$or: [{username: username}, {mobile: mobile}]});
        if (buyer) {
            return res.status(400).json({message: 'Buyer already exists'});
        }
        const newaddress = {
            zip, details : address,
            name, mobile
        }
        const newBuyer = new Buyer({
            name, username, mobile, 
            password : encryption(password) , address: newaddress._id
        });
        const savedBuyer = await newBuyer.save();
        const token = jwt.sign({BuyerId: savedBuyer._id}, process.env.JWT_TOKEN, {
            expiresIn: '3h'
        });
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
        if (buyer.password != encryption(password)) {
            return res.status(400).json({message: 'Invalid Password'});
        }
        const token = jwt.sign({BuyerId: buyer._id}, process.env.JWT_TOKEN, {
            expiresIn: '3h'
        });
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 *
 * @method GET
 * @link http://localhost:3000/api/buyer/getAllProducts
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

/**
 * 
 * @method GET
 * @link http://localhost:3000/api/buyer/getProductById/:id
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

/**
 * 
 * @method POST
 * @link http://localhost:3000/api/buyer/addToCart
 * @returns cart
 */

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId).select('name price seller');
        if (!product) {
            return res.status(400).json({message: 'Product does not exist'});
        }
        const newObject = new UserProduct({
            productId, quantity, name: product.name, price: product.price,
            sellerId : product.seller
        });
        const savedObject = await newObject.save();
        await Buyer.findByIdAndUpdate(req.Buyer._id, {$addToSet: {carts: savedObject._id}});
        res.status(200).json(savedObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 
 * @method GET
 * @link http://localhost:3000/api/buyer/cart
 * @returns cart
 */

exports.getCart = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.Buyer._id)
            .select('carts').populate('carts');
        res.status(200).json(buyer.carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method DELETE
 * @link http://localhost:3000/api/buyer/cart/:id
 * @returns cart
 */

exports.deleteProductFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const buyer = await Buyer.findById(req.Buyer._id);
        buyer.carts.pull(id);
        await buyer.save();
        await UserProduct.findByIdAndDelete(id);
        res.status(200).json({message: 'Product deleted from cart'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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

/**
 * 
 * @method PUT
 * @link http://localhost:3000/api/buyer/profile
 * @returns buyer
 */

exports.updateProfile = async (req, res) => {
    try {
        const { name, mobile } = req.body;
        const buyer = await Buyer.findByIdAndUpdate(req.Buyer._id, {
            $set : {name, mobile}
        });
        res.status(200).json(buyer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
