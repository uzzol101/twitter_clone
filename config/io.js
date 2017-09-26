const async = require("async");
const Tweet = require("../models/tweet");
const User = require("../models/user");

module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('A user connected');
        var user = socket.request.user;

        socket.on("tweet", function(data) {
            async.parallel([
                function(callback) {
                    io.emit("incommingTweet", { data, user });

                },
                function(callback) {
                    async.waterfall([
                        function(callback) {
                            // console.log(data, user);
                            var tweet = new Tweet();
                            tweet.owner = user._id;
                            tweet.content = data.content;
                            tweet.save((err, tweet) => {

                                callback(err, tweet);


                            });


                        },
                        function(tweet, callback) {

                            User.update({ _id: user._id }, { $push: { tweets: tweet._id } }, (err, tweetSaved) => {

                                    callback(err, tweetSaved);
                                    // end of callback
                                }

                            );
                        }

                    ]);
                }
            ]);
        });
        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', function() {
            console.log('A user disconnected');
        });

    });

}
// User.find({}, (err, user) => {
            //     console.log(user);
            // })
// User.remove({}, (err, user) => {
//     console.log("user removed");
// })

// Tweet.remove({}, (err, user) => {
//     console.log("user removed");
// })