const Address = require('../models/AddressModel');
const Seller = require('../models/SellerModel');
const Product = require('../models/ProductModel');
const BuyerModel = require('../models/BuyerModel')
const Order = require('../models/odersModel');

// Create NewOrder
/**
 *
 * @method POST
 * @link http://localhost:3000/api/order/CreateNewOrder
 * @returns {object} Order
 */

exports.CreateNewOrder = async (req, res) => {
    try {
        const { address, zip } = req.body;
        let Buyer = await BuyerModel.findById(req.Buyer._id).populate('carts');
        let Cart = Buyer.carts;
        const newAddress = new Address({
            details : address, zip,
            name : req.Buyer.name, mobile : req.Buyer.mobile
        });
        for (let i = 0; i < Cart.length; i++) {
            const SellerId = Cart[i].sellerId;
            const newOrder = new Order({
                ...Cart[i], buyer : Buyer._id, seller : SellerId,
                address : newAddress._id, status : "successfully Orderd",
            });
            Buyer.carts.push(newOrder._id);
            await Seller.findByIdAndUpdate(SellerId, {
                $push : { orders : newOrder._id }
            });
            await newOrder.save();
        }
        Buyer.carts = [];
        await newAddress.save();
        await Buyer.save();
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}

// delete order
/**
 * @method DELETE
 * @link http://localhost:3000/api/order/DeleteOrder
 * @returns {object} Order
 */

exports.DeleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'order not found' });
        }
        await BuyerModel.findByIdAndUpdate(req.Buyer._id, {
            $pull : { carts : order._id }
        });
        await Seller.findByIdAndUpdate(order.seller, {
            $pull : { orders : order._id }
        });
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'order deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}