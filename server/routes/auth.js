const express = require("express");
const router = express.Router();
const crypto = require("crypto");

//Require the middleware for verification of token
const requireLogin = require("../middleware/requireLogin");

//Use mongoDB to store the posted data
const mongoose = require("mongoose");
const User = mongoose.model("User");

//Using bcrypt for hashing the passwords
const bcrypt = require("bcrypt");

//Generating token for users to access private resources
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/keys");

//email verification setup
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

//Make a post request for signup page
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    console.log(name, email, password);
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  //Store the data in mongo DB
  //Find if the email already exists
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "Email Id already exists in the database" });
      }
      //Hash the password before storing in DB
      bcrypt.hash(password, 12).then((hashedPass) => {
        //Create the new user object
        const user = new User({
          name,
          email,
          password: hashedPass,
          pic,
        });
        //Save the user and display message
        user
          .save()
          //If promise resolved
          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: "no-reply@insta.com",
              subject: "Signup Sucessfull",
              html: "<h1> Welcome to Instagram </h1>",
            });
            res.json({ message: "Successfully signed in!" });
          })
          //Else log the error
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Make a post request for the signin page
router.post("/signin", (req, res) => {
  // take post data from the sign in page
  const { email, password } = req.body;
  //Check for empty fields
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter the credentials" });
  }
  //Find if the email exists in the database or not
  User.findOne({ email: email })
    .then((savedUser) => {
      //If user not in database, throw error
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email ID or password" });
      }
      //If the user does exist, then compare the password
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res
              .status(422)
              .json({ error: "Invalid Email ID or password" });
          }
          //If password is right
          else {
            //If user is authenicated, then generate the token and assign it
            //Generating token on basis of user id and storing id in "_id"
            const token = jwt.sign({ _id: savedUser._id }, JWT_KEY);
            const { _id, name, email, followers, following, pic } = savedUser;
            return res.json({
              token: token,
              user: { _id, name, email, followers, following, pic },
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Make a request to reset password
// router.post("/reset-password", (req, res) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//     }
//     const token = buffer.toString("hex");
//     User.findOne({ email: req.body.email }).then((user) => {
//       if (!user) {
//         return res
//           .status(422)
//           .json({ error: "User does not exists with that email" });
//       }
//       user.resetToken = token;
//       user.expireToken = Date.now() + 3600000;
//       user.save().then((result) => {
//         transporter.sendMail({
//           to: user,
//           from: "instaclone0223@gmail.com",
//           subject: "Password Reset",
//           html: `
//           <p>You have requested for password reset.</p>
//           <h5>Click on this <a href = "http://localhost:3000/reset/${token}">link</a> to reset the password</h5>
//           `,
//         });
//         res.json({ message: "Check your email for the reset link" });
//       });
//     });
//   });
// });

//Export router to other modules
module.exports = router;
