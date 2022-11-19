const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name , email, photo, password, password confirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    maxlength: [40, 'A name must have less or equal then 40 characters'],
    minlength: [2, 'A name must have more or equal then 10 characters'],
  },
  email: {
    type: String,
    required: [true, 'User must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'A password must have more or equal then 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: [8, 'A  password must have more or equal then 8 characters'],
    validate: {
      // This only works CREATE and SAVE
      validator: function (el) {
        return el === this.password; //
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //Only runs if password was modified
  if (!this.isModified('password')) return next();

  //Hash password in 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete confirm password field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (candiatePassword, userPassword) {
  return bcrypt.compare(candiatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
}
const User = mongoose.model('User', userSchema);

module.exports = User;
