var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multer  = require('multer');
var fs = require("fs");
var file = __dirname + "/data/" + "userdirectory.sqlite";
var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE User (" +
            " Id INTEGER PRIMARY KEY AUTOINCREMENT," +
            " FirstName nvarchar(50)," +
            " LastName nvarchar(50)," +
            " ImageUrl nvarchar(50))");
    
    var stmt = db.prepare("INSERT INTO User('FirstName','LastName','ImageUrl') VALUES ('test', 'test', 'test@gmail.com')");
    stmt.run();
    stmt.finalize();
  }
});

var routes = require('./routes/index');
var users = require('./routes/users');

var exphbs  = require('express3-handlebars');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(multer({ dest: './uploads/'}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
