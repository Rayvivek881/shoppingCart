const router = require('express').Router();
const BuyerAuth = require('../middlewares/BuyerAuth.js');
const {
    CreateNewOrder, DeleteOrder
} = require('../controllers/OrderController');

router.route('/CreateNewOrder').post(BuyerAuth, CreateNewOrder);
router.route('/DeleteOrder/:id').delete(BuyerAuth, DeleteOrder);

module.exports = router;