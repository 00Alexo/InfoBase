const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
    problemId:{
        type: String,
        required: true,
        unique: true
    },
    problemName:{
        type: String,
        required: true
    },
    problemDifficulty: {
        type: String,
        required: true
    },
    specialDate:{
        type: String,
        required: true,
        unique: true
    }
  }, {timestamps: true});

  const CalendarCollection = mongoose.model("CalendarCollection", CalendarSchema);

  module.exports = CalendarCollection;