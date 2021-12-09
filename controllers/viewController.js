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
  // Get all tours data
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Exciting tours',
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

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

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
