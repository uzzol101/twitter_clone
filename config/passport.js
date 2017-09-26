const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local");


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            console.log("user not found");
            return done(null, false);
        }
        user.comparePassword(password).then((isMatch) => {
            console.log(isMatch);
            if (isMatch) {
                req.flash("success", "You are now loged in");
                return done(null, user)
            } else {
                req.flash("error", "Oops wrong password");
                return done(null, false);
            }
        });

    });
}));