const Router = require('express');
const router = new Router();
const subscriptionRouter = require('./subscriptionRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');
const adminRouter = require('./adminRouter');

router.use('/user', userRouter);
router.use('/subscription', subscriptionRouter);
router.use('/basket', basketRouter);
router.use('/admin', adminRouter);

module.exports = router;
