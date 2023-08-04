const express = require('express');
const callLogs = require('../controllers/callLogs/callLogsController.js');

const router = express.Router();

router.route('/').post(callLogs.createCallLogs);
router.route('/').put(callLogs.updateCallLogs);
router.route('/:device_id').get(callLogs.getCallLogsByDeviceId);

module.exports = router;
