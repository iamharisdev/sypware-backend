const express = require('express');
const appUsages = require('../controllers/appUsages/appUsages.js');

const router = express.Router();

router.route('/').post(appUsages.createAppUsages);

module.exports = router;
