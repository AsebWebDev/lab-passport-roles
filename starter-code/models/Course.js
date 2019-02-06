const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  courseName: String,
  sport: {
    type: String,
    enum: ["basketball", "football", "tennis"]
  },
  location: {
    type: {
      type: String,
      enum: ["Point"], 
      default: "Point"
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  }

});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;