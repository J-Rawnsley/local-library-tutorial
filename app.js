const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const debug = require('debug')('main');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit")
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100
})

// During development & when testing locally, use one of the connct strings stored in dev_secrets:

// for development database cluster
// const mongoDB = require("./dev_secrets/dev_db_url")

// to use production database cluster
// const mongoDB = require("./dev_secrets/prod_db_url")

// for production deployment use the following:
console.log("hello 1")
const mongoDB = process.env.MONGODB_URI
console.log("hello 2")


main().catch((err) => debug(err));
async function main() {
  mongoose.connect(mongoDB);
}

// view engine setupmacomprethessionin
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(
  helmet({
    directives: {
      'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
    },
  })
);
app.use(limiter)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
