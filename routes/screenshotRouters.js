const express = require('express');
const screenshot = require('../controllers/screenshots/screenshotController.js');
const upload = require('../middlewares/multer.js');

const router = express.Router();

router
  .route('/')
  .post(upload.single('screenShot_Url'), screenshot.createScreenShots);

router.route('/:device_id').get(screenshot.getAllScreenShots);

router.route('/').delete(screenshot.deleteScreenShots);

module.exports = router;
