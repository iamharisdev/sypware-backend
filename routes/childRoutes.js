const express = require('express');
const childController = require('../controllers/child/childController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.route('/').post(childController.createChild);
router.route('/').get(childController.getAll);
router.route('/:parent_id').get(childController.getChildsByParentId);
router.route('/').patch(childController.updateChild);
router.route('/').delete(childController.deleteChild);

module.exports = router;
