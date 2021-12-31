const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverView);
router.get('/tours/page/:page/sort/:sortBy', viewController.getOverView);
router.get('/tours/page/:page', viewController.getOverView);
router.get('/top-5-tours', viewController.getTop5Tours);

router.get('/search', viewController.searchTour);

router.get('/my-tours', authController.protect, viewController.getMyTours);
router.get('/tour/:slug', viewController.getTour);

router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/forgot-password', viewController.forgotPassword);
router.get('/reset-password/:token', viewController.resetPassword);

router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/add-review/:tourSlug',
  authController.protect,
  authController.restrictTo('user'),
  viewController.addReview
);

/**
 * ROUTE FOR ADMIN
 */
router.get('/users', authController.protect, viewController.getAllUser);
router.get('/users/search', authController.protect, viewController.searchUser);
router.get(
  '/users/page/:page',
  authController.protect,
  viewController.getAllUser
);

module.exports = router;
