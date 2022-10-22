const router = require('express').Router();
const SellerAuth = require('../middlewares/SellerAuth.js');
const {
    sellerSignUp, sellerSignIn, addProduct, getProducts, updateProduct, 
    deleteProduct, getOrders, updateOrder, deleteOrder
} = require('../controllers/sellerConteroller.js');

router.route('/signup').post(sellerSignUp);
router.route('/signin').post(sellerSignIn);
router.route('/addProduct').post(SellerAuth, addProduct);
router.route('/getProducts').get(SellerAuth, getProducts);
router.route('/updateProduct/:id').put(SellerAuth, updateProduct);
router.route('/deleteProduct/:id').delete(SellerAuth, deleteProduct);

module.exports = router;