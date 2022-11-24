const fs = require('fs');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//ROUTE HANDLERS
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Do not attempt to change password with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);


exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTS password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  //2) Filter out unwanted changes
  const filteredBody = filterObj(req.body, 'name', 'email');

  //3) post user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined! Please use /signup instead',
  });
};



// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Route not yet defined',
//   });
// };
