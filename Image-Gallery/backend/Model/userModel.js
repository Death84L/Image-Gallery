const mongoose = require("mongoose");

const User = new mongoose.Schema(
{
    username: {
    type: String,
    required: [true, "Please Enter Your Name"],
    unique: true,
    },
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
    },
    profession: {
        type: String,
    },

},
    {collection : 'user-data'}
  );

  
const model= mongoose.model('UserData' , User)
module.exports= model;