const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');

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

  // Get all tours data
  let query = Tour.find().skip(skip).limit(limit);
  const maxPage = Math.ceil((await Tour.countDocuments()) / limit);

  // SORT
  let tours;
  const { sortBy } = req.params;
  if (sortBy) tours = await query.sort(sortBy).sort('_id');
  else tours = await query.sort('-createdAt _id');

  res.status(200).render('overview', {
    title: 'All Exciting tours',
    tours,
    maxPage,
    current: page,
    sortBy,
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
    title: 'Your tours',
    tours,
  });
});

// SEARCH TOUR
exports.searchTour = catchAsync(async (req, res, next) => {
  const value = req.query.name.toLowerCase().split(' ').join('');
  const tours = await Tour.find();

  const data = tours.filter((tour) =>
    tour.name.split(' ').join('').toLowerCase().includes(value)
  );

  if (data.length === 0) return next(new AppError('No tour found!', 404));

  res.status(200).render('overview', {
    title: `Search ${value}`,
    tours: data,
  });
});

exports.addReview = (req, res) => {
  res.status(200).render('addReview', {
    title: 'Add Review',
    tour: 'The Forest Hiker',
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
