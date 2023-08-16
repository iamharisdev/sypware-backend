const express = require('express');
const childController = require('../controllers/child/childController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.route('/').post(auth, childController.createChild);
router.route('/').get(auth, childController.getAll);
router
  .route('/childsbyparentId')
  .get(auth, childController.getChildsByParentId);
router.route('/').patch(auth, childController.updateChild);
router.route('/').delete(auth, childController.deleteChild);

module.exports = router;
