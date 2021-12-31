const slug = require('slugify');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');

// CREATE ALERT MESSAGE TO BODY AFTER BOOKING A TOUR
exports.alerts = (req, res, next) => {
  const { alert } = req.query;

  if (alert === 'booking') {
    const message =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";

    res.locals.alert = message;
  }
  next();
};

// ALL TOURS
exports.getOverView = catchAsync(async (req, res, next) => {
  // PAGINATE
  const limit = 3;
  const page = req.params.page * 1 || 1;
  const skip = (page - 1) * limit;
  const query = Tour.find().skip(skip).limit(limit);
  const maxPage = Math.ceil((await Tour.countDocuments()) / limit);

  // SORT
  let tours;
  const { sortBy } = req.params;
  if (sortBy) tours = await query.sort(sortBy).sort('-createdAt _id');
  else tours = await query.sort('-createdAt _id');

  res.status(200).render('overview', {
    title: 'All Exciting tours',
    tours,
    maxPage,
    current: page,
    sortBy,
  });
});

// SEARCH TOUR
exports.searchTour = catchAsync(async (req, res, next) => {
  // Get the name to search
  const value = slug(req.query.name);
  const tours = await Tour.find({ slug: { $regex: value } });

  if (tours.length === 0) return next(new AppError('No tours found!', 404));

  res.status(200).render('overview', {
    title: `Search for ${value}`,
    tours,
  });
});

// TOUR DETAIL
exports.getTour = catchAsync(async (req, res, next) => {
  // get tour from req
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review user photo rating',
  });

  if (!tour) return next(new AppError('No tour found with that name', 404));

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

// GET MY BOOKING TOUR
exports.getMyTours = catchAsync(async (req, res, next) => {
  // Find all booking
  const bookings = await Booking.find({ user: req.user.id });

  // Find tours with returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});

// GET TOP 5 BEST CHEAP TOURS
exports.getTop5Tours = catchAsync(async (req, res, next) => {
  const limit = 5;
  const sortBy = 'price -ratingAverage';

  const tours = await Tour.find().sort(sortBy).limit(limit);

  res.status(200).render('overview', {
    title: 'Top 5 tours',
    tours,
  });
});

exports.addReview = async (req, res) => {
  const { tourSlug } = req.params;
  const tour = await Tour.findOne({ slug: tourSlug });
  res.status(200).render('addReview', {
    title: 'Add Review',
    tour,
  });
};

exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up new account',
  });
};

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Login your account',
  });
};

exports.forgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot password',
  });
};

exports.resetPassword = (req, res) => {
  const { token } = req.params;
  res.status(200).render('resetPassword', {
    title: 'Reset your password',
    token,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

/**
 * ADMIN FUNCTIONALITY
 */
// GET ALL USERS
exports.getAllUser = catchAsync(async (req, res, next) => {
  // PAGINATE
  const limit = 8;
  const page = req.params.page * 1 || 1;
  const skip = (page - 1) * limit;
  const query = User.find().populate('tours').skip(skip).limit(limit);
  const maxPage = Math.ceil((await User.countDocuments()) / limit);

  // SORT
  let users;
  const { sortBy } = req.params;
  if (sortBy) users = await query.sort(sortBy).sort('-createdAt _id');
  else users = await query.sort('-createdAt _id');

  res.status(200).render('users', {
    title: 'All Users',
    users,
    maxPage,
    current: page,
    sortBy,
  });
});

// SEARCH USERS
exports.searchUser = catchAsync(async (req, res, next) => {
  // Get query value
  const value = req.query.name;

  // Find user by name ignore case
  const users = await User.find({
    name: { $regex: value, $options: 'i' },
  }).populate('tours');

  if (users.length === 0)
    return next(new AppError('No user found with that name!', 404));

  res.status(200).render('users', {
    title: `Search for ${value}`,
    users,
  });
});
