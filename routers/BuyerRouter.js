const router = require('express').Router();
const BuyerAuth = require('../middlewares/BuyerAuth.js');
const {
    buyerSignUp, buyerSignIn, getAllProducts, addToCart, getCart, getProductById,
    clearCart, deleteProductFromCart, updateProductQuantityInCart, searchProducts
} = require('../controllers/BuyerController');

router.route('/signup').post(buyerSignUp);
router.route('/signin').post(buyerSignIn);
router.route('/getAllProducts').get(BuyerAuth, getAllProducts);
router.route('/addToCart').post(BuyerAuth, addToCart);
router.route('/getProductById/:id').get(BuyerAuth, getProductById);
router.route('/getCart').get(BuyerAuth, getCart);
router.route('/clearCart').delete(BuyerAuth, clearCart);
router.route('/deleteProductFromCart/:id').delete(BuyerAuth, deleteProductFromCart);
router.route('/updateProductQuantityInCart/:id').put(BuyerAuth, updateProductQuantityInCart);
router.route('/searchProducts').post(BuyerAuth, searchProducts);

module.exports = router;