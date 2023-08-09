const express = require('express');
const childController = require('../controllers/child/childController');

const router = express.Router();

router.route('/').post(childController.createChild);
router.route('/').get(childController.getAll);
router.route('/childsbyparentId').get(childController.getChildsByParentId);
router.route('/').patch(childController.updateChild);
router.route('/').delete(childController.deleteChild);

module.exports = router;
