const express = require('express');
const callLogs = require('../controllers/callLogs/callLogsController.js');
const { auth } = require('../middlewares/auth.js');

const router = express.Router();

router.route('/').post(auth, callLogs.createCallLogs);
router.route('/').put(auth, callLogs.updateCallLogs);
router.route('/:device_id').get(auth, callLogs.getCallLogsByDeviceId);

module.exports = router;
