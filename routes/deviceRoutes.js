const express = require('express');
const deviceController = require('../controllers/device/deviceController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.route('/').post(auth, deviceController.createDevice);
router.route('/').put(auth, deviceController.updateDevice);
router.route('/getAll/:child_id').get(auth, deviceController.getAllDevices);
router
  .route('/getById/:device_id')
  .get(auth, deviceController.getDevicebyDeviceId);
router.route('/createDevicePin').post(auth, deviceController.createDevicePin);
router.route('/loginWithPin').post(auth, deviceController.loginWithPin);
router
  .route('/getdevices_childid')
  .get(auth, deviceController.getDevicebyChildId);
router.route('/modules').post(auth, deviceController.ModulesTime);

module.exports = router;
