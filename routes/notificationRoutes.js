const express = require('express');
const notificationController = require('../controllers/pushNotification/notificationControllers');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.route('/').post(auth, notificationController.pushNotification);
router.route('/deviceToken').post(auth, notificationController.deviceToken);

module.exports = router;
