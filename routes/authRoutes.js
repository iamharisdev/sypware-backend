const express = require('express');
const authController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/verifyOtp').post(authController.verifyOtp);
router.route('/resetPassword').patch(authController.resetPassword);
router.route('/changePassword').patch(auth, authController.changePassword);
router
  .route('/updateUser')
  .patch(upload.single('profileImage'), auth, authController.updateUser);

module.exports = router;
