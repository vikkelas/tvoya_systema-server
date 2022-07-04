const Router = require('express');
const router = new Router();
const subscriptionController = require('../controllers/subscriptionController')
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const statusMiddleware = require('../middleware/statusMiddleware');

router.post('/create',authMiddleware, checkRoleMiddleware, subscriptionController.add);
router.get('/',authMiddleware, statusMiddleware,subscriptionController.getAll);
router.delete('/:id',authMiddleware, checkRoleMiddleware, subscriptionController.delete);
router.put('/put',authMiddleware, checkRoleMiddleware,subscriptionController.change);

module.exports = router;
