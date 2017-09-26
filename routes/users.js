var express = require('express');
var router = express.Router();
var User = require("../models/user");
var async = require("async");

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    async.waterfall([
        function(callback) {
            User.findById(req.params.id).populate("tweets").exec((err, userTweets) => {
                callback(err, userTweets);
            })
        },
        function(userTweets, callback) {
            User.findById(req.params.id).populate("followers").populate("following").exec((err, user) => {
                // check if the profile you alredy following

                var following = user.followers.some(function(friend) {
                    return friend.equals(req.user._id);
                });

                var followers = user.followers.length;

                var currentUser;
                if (req.user._id.equals(user._id)) {
                    currentUser = true;
                } else {
                    currentUser = false;
                }

                res.render("profile", { user: userTweets, follow: user, currentUser: currentUser, following: following, followers: followers });

            });
        }
    ]);
});

//FOLLOW

router.post("/follow/:id", (req, res, next) => {

    async.parallel([
        function(callback) {
            User.update({ _id: req.user._id, following: { $ne: req.params.id } }, { $push: { following: req.params.id } }, (err, user) => {
                callback(err, user)
                console.log(user);
            })
        },
        function(callback) {
            User.update({ _id: req.params.id, followers: { $ne: req.user._id } }, { $push: { followers: req.user._id } }, (err, user) => {
                callback(err, user)
                console.log(user);
            })
        }
    ], (err, data) => {
        if (err) return next(err);
        res.json("Success")
    })

});


// UN FOLLOW


router.post("/unfollow/:id", (req, res, next) => {
    console.log("****************************");
    console.log("here you are");
    console.log(req.params.id);
    async.parallel([
        function(callback) {
            User.update({ _id: req.user._id }, { $pull: { following: req.params.id } }, (err, user) => {
                callback(err, user)
                console.log(user);
            })
        },
        function(callback) {
            User.update({ _id: req.params.id }, { $pull: { followers: req.user._id } }, (err, user) => {
                callback(err, user)
                console.log(user);
            })
        }
    ], (err, data) => {
        if (err) return next(err);
        res.json("Success")
    })

});


module.exports = router;