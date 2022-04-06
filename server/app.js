const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

//Destructure MONGO uri from keys
const { MONGOURI } = require("./config/keys");

//Connect to mongo DB
mongoose.connect(MONGOURI);

//If connecton is sucessful
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

//If connection is unsuccessful
mongoose.connection.on("error", (err) => {
  console.log("Error while connected to MongoDB", err);
});

//Require the schema from user.js
require("./models/user");
//Require the schema from post.js
require("./models/post");

//Parse the json data and create a middleware for it (MW)
app.use(express.json());

//Rerquire routes from the auth module (MW)
app.use(require("./routes/auth"));

//Rerquire routes from the auth module (MW)
app.use(require("./routes/post"));

//Rerquire routes from the user module (MW)
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
