const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

//create a route to request all the posts on the app
router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
});

//route to get posts of people whom I follow
router.get("/followedposts", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Create a post route which takes input from user and saves in the DB
router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.json({ error: "Please complete all the fields" });
  }
  //Do not store the password in new post object
  req.user.password = undefined;

  //Create a post object
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  //Store the post object in database
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((error) => {
      console.log(error);
    });
});

//create a get route to view the posts of the user signed in
router.get("/mypost", requireLogin, (req, res) => {
  //find the posts by the user signed in
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Create a update request for updating likes and dislikes
router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/dislike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error: error });
      } else {
        res.json(result);
      }
    });
});

//Create a update request for updating comments
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

//Request to delete the post
router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
});

module.exports = router;
