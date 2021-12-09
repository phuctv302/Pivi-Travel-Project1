const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSChema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide us your name!'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  email: {
    type: String,
    required: [true, 'Please provide us your name!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'Please provide us password!'],
    minlength: [8, 'Password must have more or equal 8 character'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Encrypt password before saving into DB
userSChema.pre('save', async function (next) {
  // Only encrypt when password is modified
  if (!this.isModified('password')) return next();

  // Hashing password
  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm in DB
  this.passwordConfirm = undefined;

  next();
});

// UPDATE PASSWORD_CHANGED_AT
userSChema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// HIDE THE INACTIVE USER
userSChema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// CHECK PASSWORD INPUT IS CORRECT
userSChema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// CHECK PASSWORD IS CHANGED AFTER THE TOKEN IS ISSUED
userSChema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt / 1000, 10);
    return changedTimestamp > JWTTimestamp;
  }

  return false; // Not changed
};

// GENERATE RANDOM TOKEN
userSChema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expires after 10m

  return resetToken;
};

const User = mongoose.model('User', userSChema);
module.exports = User;
