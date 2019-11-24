//Loading Config...
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

//Express Stuff
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//Mongoose for DB Schemas
var mongoose = require('mongoose');

//Connecting to MongoDB
mongoose.connect(config.mongoAddress);
require('./models/models.js');

//Initializing Routes
var index = require('./routes/index');
var api = require('./routes/api');

//Initializing Express app
var app = express();

//Views setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: config.sessionSecret
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Setting up API Routes
app.use('/', index);
app.use('/api', api);

//Handling 404s
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Normal Error Handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;