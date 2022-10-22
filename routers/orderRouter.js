const router = require('express').Router();
const BuyerAuth = require('../middlewares/BuyerAuth.js');
const {
    CreateNewOrder, DeleteOrder
} = require('../controllers/OrderController');

router.route('/createNewOrder').post(BuyerAuth, CreateNewOrder);
router.route('/deleteOrder/:id').delete(BuyerAuth, DeleteOrder);

module.exports = router;