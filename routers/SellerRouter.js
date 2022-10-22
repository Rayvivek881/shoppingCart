const router = require('express').Router();
const SellerAuth = require('../middlewares/SellerAuth.js');
const {
    sellerSignUp, sellerSignIn, addProduct, getProducts, updateProduct, getOrdersByStatus, getProductsByName, 
    deleteProduct, getOrders, updateOrder, deleteOrder, getProfile, updateProfile, getProductsByCategory
} = require('../controllers/sellerConteroller.js');

router.route('/signup').post(sellerSignUp);
router.route('/signin').post(sellerSignIn);
router.route('/addProduct').post(SellerAuth, addProduct);
router.route('/getProducts').get(SellerAuth, getProducts);
router.route('/updateProduct/:id').put(SellerAuth, updateProduct);
router.route('/deleteProduct/:id').delete(SellerAuth, deleteProduct);
router.route('/getOrders').get(SellerAuth, getOrders);
router.route('/updateOrder/:id').put(SellerAuth, updateOrder);
router.route('/deleteOrder/:id').delete(SellerAuth, deleteOrder);
router.route('/getProfile').get(SellerAuth, getProfile);
router.route('/updateProfile').put(SellerAuth, updateProfile);
router.route('/getProductsByCategory/:category').get(SellerAuth, getProductsByCategory);
router.route('/getProductsByName/:name').get(SellerAuth, getProductsByName);
router.route('/getOrdersByStatus/:status').get(SellerAuth, getOrdersByStatus);

module.exports = router;