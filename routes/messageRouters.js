const express = require('express');
const messages = require('../controllers/messages/messgaesController.js');

const router = express.Router();

router.route('/').post(messages.createMessages);
router.route('/').put(messages.updateMessages);
router.route('/:device_id').get(messages.getMessagesByDeviceId);

module.exports = router;
