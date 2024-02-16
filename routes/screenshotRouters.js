const express = require('express');
const screenshot = require('../controllers/screenshots/screenshotController.js');
const upload = require('../middlewares/multer.js');
const { auth } = require('../middlewares/auth.js');

const router = express.Router();

router
  .route('/')
  .post(upload.single('screenShot_Url'), auth, screenshot.createScreenShots);

router.route('/:device_id').get(auth, screenshot.getAllScreenShots);

router.route('/').delete(auth, screenshot.deleteScreenShots);

module.exports = router;
