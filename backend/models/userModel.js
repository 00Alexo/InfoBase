const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    submissions:{
        type: [Object],
        default: [],
        required: true
    }
  }, {timestamps: true});
  
  const UserCollection = mongoose.model("UserCollection", UserSchema);
  
  module.exports = UserCollection; 