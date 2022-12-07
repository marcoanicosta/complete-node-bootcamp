const express = require('express');
const bokkingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-sessions/:tourID',
  authController.protect,
  bokkingController.getCheckoutSession
);

module.exports = router;
