const mongoose = require("mongoose");

//setup Schema
const campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment" //embed comment
    }
  ]
});

//compiling a schema into a model
module.exports = mongoose.model("Campground", campgroundSchema);

