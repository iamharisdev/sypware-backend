const express = require('express');
const deviceController = require('../controllers/device/deviceController');
const upload = require('../middlewares/multer');

const router = express.Router();

router.route('/').post(deviceController.createDevice);
router.route('/').put(deviceController.updateDevice);
router.route('/getAll/:child_id').get(deviceController.getAllDevices);
router.route('/getById/:device_id').get(deviceController.getDevicebyDeviceId);
router.route('/createDevicePin').post(deviceController.createDevicePin);
router.route('/loginWithPin').post(deviceController.loginWithPin);
router.route('/callLogs').post(deviceController.createCallLogs);
router.route('/callLogs').put(deviceController.updateCallLogs);
router
  .route('/callLogs/:device_id')
  .get(deviceController.getCallLogsByDeviceId);
router.route('/messages').post(deviceController.createMessages);
router.route('/messages').put(deviceController.updateMessages);
router
  .route('/messages/:device_id')
  .get(deviceController.getMessagesByDeviceId);

router
  .route('/screenshot')
  .post(upload.single('screenShot_Url'), deviceController.createScreenShots);

module.exports = router;
