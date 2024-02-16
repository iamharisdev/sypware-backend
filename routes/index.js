const express = require('express');
const authRouter = require('./authRoutes');
const childRouter = require('./childRoutes');
const parentRouter = require('./parentRoutes');
const deviceRouter = require('./deviceRoutes');
const notificationRouter = require('./notificationRoutes');
const callLogsRoute = require('./callLogsRoutes');
const messagesRouter = require('./messageRouters');
const screenshotRouter = require('./screenshotRouters');
const locationRouter = require('./locationRoutes');
const appUsagesRouter = require('./appUsagesRoutes');

const router = express.Router();

router.use('/users', authRouter);
router.use('/child', childRouter);
router.use('/parent', parentRouter);
router.use('/device', deviceRouter);
router.use('/notification', notificationRouter);
router.use('/calllogs', callLogsRoute);
router.use('/messages', messagesRouter);
router.use('/screenshots', screenshotRouter);
router.use('/location', locationRouter);
router.use('/app_Usages', appUsagesRouter);

module.exports = router;
