var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var index = require('./routes/index');
var users = require('./routes/users');
const flash = require("connect-flash");
const session = require('express-session');
const mongoStore = require("connect-mongo")(session);
const passportSocketIo = require("passport.socketio");
const passport = require("passport");

var app = express();
const http = require("http").Server(app);

const io = require("socket.io")(http);
// database
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.openUri("mongodb://localhost/user", () => {
    console.log("databsae connected");
});

const sessionStore = new mongoStore({ url: "mongodb://localhost/user", autoReconnect: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: sessionStore
}));

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser, // the same middleware you registrer in express 
    // key: 'connect.sid', // the name of the cookie where express/connect stores its session_id 
    secret: 'keyboard cat', // the session_secret to parse the cookie 
    store: sessionStore, // we NEED to use a sessionstore. no memorystore please 
    success: onAuthorizeSuccess, // *optional* callback on success - read more below 
    fail: onAuthorizeFail, // *optional* callback on fail/error - read more below 
}));

function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');

    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
    if (error)
        throw new Error(message);
    console.log('failed connection to socket.io:', message);


    accept(null, false);


    if (error)
        accept(new Error(message));

}

//Whenever someone connects this gets executed
require("./config/io")(io);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});




app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
http.listen(3000, () => {
    console.log("app started");
})

module.exports = app;