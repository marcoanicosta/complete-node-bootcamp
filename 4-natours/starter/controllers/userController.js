const fs = require('fs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

//ROUTE HANDLERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    rquestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  req.status(500).json({
    status: 'error',
    message: 'Route not yet defined',
  });
};
exports.createUser = (req, res) => {
  req.status(500).json({
    status: 'error',
    message: 'Route not yet defined',
  });
};
exports.updateUser = (req, res) => {
  req.status(500).json({
    status: 'error',
    message: 'Route not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  req.status(500).json({
    status: 'error',
    message: 'Route not yet defined',
  });
};
