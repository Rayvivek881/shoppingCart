const router = require('express').Router();
const {
    sellerSignUp, sellerSignIn
} = require('../controllers/sellerConteroller.js');

router.route('/signup').post(sellerSignUp);
router.route('/signin').post(sellerSignIn);

module.exports = router;