const Router = require('express');
const adminController = require("../controllers/adminController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");



router.post('/', adminController.registration);
router.delete('/user/:id',authMiddleware, checkRoleMiddleware, adminController.deleteUser);
router.get('/users',authMiddleware, checkRoleMiddleware, adminController.getUsers);
router.get('/users/subscriptions/',authMiddleware, checkRoleMiddleware, adminController.getUserSubscriptions);
router.put('/users/subscription/', authMiddleware, checkRoleMiddleware,adminController.changeStatusSub)

module.exports = router;
