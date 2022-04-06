//Creating the user schema model
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
//Creating a schema for our model
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/instaclone0223/image/upload/v1646292815/default_cwsdkk.jpg",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

//Naming the model -> 'USER'
mongoose.model("User", userSchema);
