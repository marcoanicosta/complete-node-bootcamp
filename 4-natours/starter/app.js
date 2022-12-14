const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitise = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
//Serving  static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: 'cross-origin',
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
    // {
    //   useDefaults: true,
    //   directives: { 'script-src': ["'self'", 'https://js.stripe.com/v3/'] },
    // },
    // contentSecurityPolicy: {
    //   useDefaults: false,
    //   directives: {
    //     scriptSrcElem: ["'self'", 'https://js.stripe.com/v3/'],
    //     //scriptSrc: [''],
    //     objectSrc: ["'none'"],
    //     baseUri: ["'none'"],
    //     defaultSrc: ["'self'"],
    //     //scriptSrc: ["'self'", '*.mapbox.com'],
    //     upgradeInsecureRequests: [],
    //   },
    // },
  })
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip, please try again in an hour',
});

app.use('/api', limiter);

//Body Parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data Sanatisation:: against NOSQL query injection
app.use(mongoSanitise());

// Data Sanatisation:: against XSS
app.use(xss());

//Prevent Parameter pollution
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

app.use(compression());

//Test Middleware
app.use((req, res, next) => {
  //console.log('Hello from the middleware???? ');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  //console.log(req.headers);
});

app.use(globalErrorHandler);

module.exports = app;
