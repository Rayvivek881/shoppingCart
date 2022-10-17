const router = require('express').Router();

const {
    buyerSignUp, buyerSignIn
} = require('../controllers/BuyerController');

router.route('/signup').post(buyerSignUp);
router.route('/signin').post(buyerSignIn);

module.exports = router;