const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/verifyOtp').post(authController.verifyOtp);
router.route('/changePassword').patch(authController.changePassword);

module.exports = router;
