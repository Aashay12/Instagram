const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((error) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followid,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(422).json({ error: error });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followid },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  ).select("-password");
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowid,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(422).json({ error: error });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.unfollowid },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  ).select("-password");
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { pic: req.body.pic },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res
          .status(422)
          .json({ error: "Cannot post the pic on database" });
      }
      return res.json(result);
    }
  );
});

router.post("/searchUser", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select("_id email name")
    .then((user) => {
      res.json({ user });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
