const express = require('express');
const locationController = require('../controllers/location/locationControllers.js');
const { auth } = require('../middlewares/auth.js');

const router = express.Router();

router.route('/').post(auth, locationController.createRequest);

module.exports = router;
