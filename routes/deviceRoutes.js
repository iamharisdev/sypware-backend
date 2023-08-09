const express = require('express');
const deviceController = require('../controllers/device/deviceController');

const router = express.Router();

router.route('/').post(deviceController.createDevice);
router.route('/').put(deviceController.updateDevice);
router.route('/getAll/:child_id').get(deviceController.getAllDevices);
router.route('/getById/:device_id').get(deviceController.getDevicebyDeviceId);
router.route('/createDevicePin').post(deviceController.createDevicePin);
router.route('/loginWithPin').post(deviceController.loginWithPin);
router.route('/getdevices_childid').get(deviceController.getDevicebyChildId);
router.route('/modules').post(deviceController.ModulesTime);

module.exports = router;
