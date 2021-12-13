const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverView);
router.get('/tours/:page/:sortBy', viewController.getOverView);

router.get('/search', viewController.searchTour);

router.get('/my-tours', authController.protect, viewController.getMyTours);

router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/add-review',
  authController.protect,
  authController.restrictTo('user'),
  viewController.addReview
);

module.exports = router;
