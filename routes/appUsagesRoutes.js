const express = require('express');
const appUsages = require('../controllers/appUsages/appUsages.js');
const { auth } = require('../middlewares/auth.js');

const router = express.Router();

router.route('/').post(auth, appUsages.createAppUsages);

module.exports = router;
