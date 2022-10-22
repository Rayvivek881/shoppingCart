const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;

const SellerModel = require("../models/SellerModel.js");

const SellerAuth = async (req, res, next) => {
    const token = req.header("x-access-token") || req.body.token || req.query.token;
    if (!token) {
        return res.status(401).send("Access Denied");
    }
    try {
        const verified = jwt.verify(token, JWT_TOKEN);
        req.Seller = await SellerModel.findById(verified.Sellerid)
            .select({password: 0, products : 0, orders : 0});
        next();
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

module.exports = SellerAuth;