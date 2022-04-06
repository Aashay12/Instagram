const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // Access the token from the header
  const { authorization } = req.headers;
  //if the header does not have auth token
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  //if the header as auth, then verify the token with the secret key
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_KEY, (err, payload) => {
    //If not verified
    if (err) {
      return res.status(401).json({ error: "You must be logged in" });
    }
    //Destructure the _id from payload that we saved in the signin route
    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
