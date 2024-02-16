const express = require('express');
const parentController = require('../controllers/parent/parentController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(auth, parentController.getAll);
router.route('/:id').get(auth, parentController.getChildsByParent);

module.exports = router;
