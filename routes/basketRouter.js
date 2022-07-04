const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require("../middleware/authMiddleware");
const statusMiddleware = require("../middleware/statusMiddleware");

router.get('/add/:id', authMiddleware, statusMiddleware, basketController.addSubscription);
router.get('/',authMiddleware, statusMiddleware, basketController.requestSubscriptions); //* id корзины *//
router.delete('/:id',authMiddleware, statusMiddleware, basketController.deleteSubscription);

module.exports = router;
