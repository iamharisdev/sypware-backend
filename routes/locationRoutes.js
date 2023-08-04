const express = require('express');
const locationController = require('../controllers/location/locationControllers.js');

const router = express.Router();

router.route('/').post(locationController.createRequest);

module.exports = router;
