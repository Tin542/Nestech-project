const express = require("express");
const router = express.Router({});
const userController = require('../controllers/userController');

router.get('/current', userController.getCurrentUser);
router.get('/detail-order', userController.getDetailOrder);
module.exports = router;
