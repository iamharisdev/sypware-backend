const express = require('express');
const parentController = require('../controllers/parent/parentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(parentController.getAll);
router.route('/:id').get(parentController.getChildsByParent);

module.exports = router;
