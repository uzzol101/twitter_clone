const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tweetSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
    created: { type: Date, default: Date.now }
});


const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;