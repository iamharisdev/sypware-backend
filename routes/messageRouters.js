const express = require('express');
const messages = require('../controllers/messages/messgaesController.js');
const { auth } = require('../middlewares/auth.js');

const router = express.Router();

router.route('/').post(auth, messages.createMessages);
router.route('/').put(auth, messages.updateMessages);
router.route('/:device_id').get(auth, messages.getMessagesByDeviceId);

module.exports = router;
