const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const bookingRouter = require('./routes/bookingRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookingController = require('./controllers/bookingController');

const app = express();

// Trust proxy -> req.headers['x-forwarded-proto'] set -> can read its value
app.enable('trust proxy');

// DEFINE VIEW ENGINE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/* GLOBAL MIDDLEWARE */
// ALLOW OTHER WEBSITE TO ACCESS OUT API
app.use(cors()); // work for get, post
app.options('*', cors()); // work for patch, delete, cookie,...

// SERVER STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// PREVENT MANY REQUESTS FROM an IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 24,
  message: 'Too many requests from this IP, please try again in 1 hour!',
});

// Set secure HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use('/api', limiter);

// SEE LOG REQUEST DATA
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Webhook checkout for payment
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// body parse
app.use(express.json());

// cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Compress all text
app.use(compression());

// ROUTES
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use('/', viewRouter);

// HANDLE ERROR: For Routes not defined
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

// ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
