var createError = require('http-errors');
var express = require('express');
var expressHbs = require('express-handlebars');
var hbs = require('hbs');

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://liza:projectrestaraunt@cluster0.34ymc.mongodb.net/restaraunt?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var foodRouter = require('./routes/food');
var drinkRouter = require('./routes/drinks');
var orderRouter = require('./routes/orders');
var deleteRouter = require('./routes/delete');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))

app.engine('hbs', expressHbs({
		layoutsDir: 'views/partials',
		defaultLayout: 'layout',
		extname: 'hbs',
	})
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/food', foodRouter);
app.use('/drinks', drinkRouter);
app.use('/order', orderRouter);
app.use('/delete', deleteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
