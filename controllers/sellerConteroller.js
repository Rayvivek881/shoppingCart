const jwt = require('jsonwebtoken');
const SellerModel = require('../models/SellerModel.js');
const ProductModel = require('../models/ProductModel.js');
const OrderModel = require('../models/odersModel.js');
const AddressModel = require('../models/AddressModel.js');
const encryption = require('../middlewares/encryption.js');

/**
 * 
 * @method POST
 * @link http://localhost:3000/api/seller/signup
 * @returns token
 */

exports.sellerSignUp = async (req, res) => {
    try {
        const { 
            name, username, mobile, password ,address, zip
        } = req.body;
        const seller = await SellerModel.findOne({$or: [{username: username}, {mobile: mobile}]});

        if (seller) {
            return res.status(400).json({message: 'Seller already exists'});
        }
        const newaddress = new AddressModel({
            mobile, zip, name,
            details : address
        });
        const newSeller = new SellerModel({
            name, username, mobile, password, address: newaddress._id
        });
        newSeller.password = encryption(password);
        const savedSeller = await newSeller.save();
        await newaddress.save();

        const token = jwt.sign({Sellerid: savedSeller._id}, process.env.JWT_TOKEN, {
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
 * @link http://localhost:3000/api/seller/signin
 * @returns token
 */

exports.sellerSignIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const seller = await SellerModel.findOne({username: username});
        if (!seller) {
            return res.status(400).json({message: 'Seller does not exist'});
        }
        if (seller.password != encryption(password)) {
            return res.status(400).json({message: 'Invalid Password'});
        }
        const token = jwt.sign({Sellerid: seller._id}, process.env.JWT_TOKEN, {
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
 * @link http://localhost:3000/api/seller/addProduct
 * @returns product
 */

exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, image, category } = req.body;
        const newProduct = new ProductModel({
            name, price, description, image, category, seller: req.Seller._id
        });
        await SellerModel.updateOne({_id: req.Seller._id}, {$push: {products: newProduct._id}})
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @method GET
 * @link http://localhost:3000/api/seller/getProducts
 * @returns products
 */
exports.getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({seller: req.Seller._id});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method PUT
 * @link http://localhost:3000/api/seller/updateProduct/:id
 * @returns product
 */

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, image, category } = req.body;
        const product = await ProductModel
            .findOneAndUpdate({$and : [{_id: req.params.id}, {seller : req.Seller._id}]}, {
            $set: {
                name, price, description, image, category, seller: req.Seller._id
            }
        }, {new: true});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method DELETE
 * @link http://localhost:3000/api/seller/deleteProduct/:id
 * @returns product
 */

exports.deleteProduct = async (req, res) => {
    try {
        const product = await ProductModel
            .findOneAndDelete({$and : [{_id: req.params.id}, {seller : req.Seller._id}]});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method GET
 * @link http://localhost:3000/api/seller/getOrders
 * @returns orders
 */

exports.getOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({seller: req.Seller._id});
        console.log(req.Seller);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method PUT
 * @link http://localhost:3000/api/seller/updateOrder/:id
 * @returns order
 */

exports.updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await OrderModel.findOneAndUpdate({_id: req.params.id}, {
            $set: { status }
        }, {new: true});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method DELETE
 * @link http://localhost:3000/api/seller/deleteOrder/:id
 * @returns order
 */

exports.deleteOrder = async (req, res) => {
    try {
        const order = await OrderModel.findOneAndDelete({_id: req.params.id});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method GET
 * @link http://localhost:3000/api/seller/getProfile
 * @returns seller
 */

exports.getProfile = async (req, res) => {
    try {
        const seller = await SellerModel.findOne({_id: req.Seller._id})
            .select({password: 0, products: 0, orders: 0});
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method PUT
 * @link http://localhost:3000/api/seller/updateProfile
 * @returns seller
 */

exports.updateProfile = async (req, res) => {
    try {
        const { name, username, mobile } = req.body;
        if (await SellerModel.findOne({ $or : [{username: username}]})) {
            return res.status(400).json({message: 'Username already exists'});
        }
        const seller = await SellerModel.findOneAndUpdate({_id: req.Seller._id}, {
            $set: {
                name, username, mobile
            }
        }, {new: true});
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method GET
 * @link http://localhost:3000/api/seller/getProductsByCategory/:category
 * @returns products
 */

exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await ProductModel
            .find({category: {$regex: req.params.category, $options: 'i'}, seller: req.Seller._id});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method GET
 * @link http://localhost:3000/api/seller/getProductsByName/:name
 * @returns products
 */

exports.getProductsByName = async (req, res) => {
    try {
        const products = await ProductModel
            .find({name: {$regex: req.params.name, $options: 'i'}, seller: req.Seller._id});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @method GET
 * @link http://localhost:3000/api/seller/getOrdersByStatus/:status
 * @returns orders
 */

exports.getOrdersByStatus = async (req, res) => {
    try {
        const orders = await OrderModel
            .find({status: {$regex: req.params.status, $options: 'i'}, seller: req.Seller._id});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
