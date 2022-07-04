const Router = require('express');
const router = new Router();
const schema = require('../schema/registerSchema');
const validateReqMiddleware = require('../middleware/validateRequestSchema')
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', schema, validateReqMiddleware, userController.registration);
router.post('/login', userController.login);
router.post('/status', authMiddleware, userController.confirmStatus);
router.get('/repeatedcode', authMiddleware, userController.newConfirmationCode);

module.exports = router;
