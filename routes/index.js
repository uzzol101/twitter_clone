var express = require('express');
var bcrypt = require('bcrypt');
var User = require("../models/user");
var passport = require("passport");
var passportConfig = require("../config/passport");
const Tweet = require("../models/tweet");

var router = express.Router();

/* GET home page. */

router.get("/", (req, res, next) => {
    Tweet.find({}).populate("owner").exec((err, tweets) => {
        res.render("layout", { tweets: tweets });
    })

});


router.get('/register', function(req, res, next) {
    res.render('register');
});

router.post("/register", (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, userExist) => {
        if (err) return next(err);
        if (userExist) {
            req.flash("error", "User already exist with this eamil address");
            res.redirect("/register");
        } else {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.save((err, user) => {
                if (err) return next(err);
                req.logIn(user, (err) => {
                    if (err) return next(err);
                    res.redirect("/");
                });
            });
        }
    });


});

router.get("/login", (req, res, next) => {
    res.render("login");
});


router.post('/login',
    passport.authenticate('local-login', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });



module.exports = router;










// User.find({ email: "uzzol101@yahoo.com" }, (err, user) => {
//     console.log(user);
// })

// Tweet.remove({}, (err, user) => {
//     console.log("removed all user");
// })

// User.remove({}, (err, user) => {
//     console.log("removed all user");
// })


// User.find({}, (err, user) => {
//     console.log(user);
// })