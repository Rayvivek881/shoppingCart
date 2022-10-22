const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;

const buyerModel = require("../models/BuyerModel.js");

const BuyerAuth = async (req, res, next) => {
    const token = req.header("x-access-token") || req.body.token || req.query.token;
    if (!token) {
        return res.status(401).send("Access Denied");
    }
    try {
        const verified = jwt.verify(token, JWT_TOKEN);
        req.Buyer = await buyerModel.findById(verified.BuyerId)
            .select({password: 0, orders : 0, carts : 0, address : 0});
        next();
    } catch (err) {
        res.status(400).send({message: err.message});
    }
}

module.exports = BuyerAuth;