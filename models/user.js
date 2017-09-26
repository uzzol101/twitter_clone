const mongoose = require("mongoose");
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

userSchema.pre("save", function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        user.password = hash;

        next();
    });


})

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

var User = mongoose.model("User", userSchema);

module.exports = User;