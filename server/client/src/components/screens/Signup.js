//Create Signup page

import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

import M from "materialize-css";

//Create a module for signup page
const Signup = () => {
  //States for dyanmic changes
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadProfilePic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "instaclone0223");
    fetch("https://api.cloudinary.com/v1_1/instaclone0223/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadFields = () => {
    //Name validation
    if (!/^[a-zA-Z ]{2,30}$/.test(name)) {
      M.toast({
        html: "Invalid Name - Length should be 2-30 characters",
        classes: "#e53935 red darken-1",
      });
      return;
    }

    //Email validation
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid Email", classes: "#e53935 red darken-1" });
      return;
    }

    //Password Validation
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
      M.toast({
        html: "Invalid Password - Password length should be 6 to 20 characters with at least 1 digit, 1 uppercase and 1 lowercase letter",
        classes: "#e53935 red darken-1",
      });
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      //Will stringify the response data
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url,
      }),
    })
      //If we do get a resonspe, convert it to json format
      .then((res) => res.json())
      .then((data) => {
        //Catch the acutal data recived from the backend
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          console.log("Here");
          M.toast({ html: data.message, classes: "#43a047 green darken-1" });
          //Redirect the user to signin page
          history.push("/signin");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Send a network request to fetch the data when the user clicks on signup button
  const PostData = () => {
    if (image) {
      uploadProfilePic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="myCard ">
      <div className="card auth-card input-field ">
        <h2 className="card-logo">Instagram</h2>
        {/* Add an event listener whenever user types in the field */}
        {/* Name field */}
        <input
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        ></input>
        {/* Email field */}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        {/* Password field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        ></input>
        {/* Upload profile photo */}
        <div className="file-field input-field">
          <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
            <span>Upload Profile Pic</span>
            <input
              type="file"
              onChange={(event) => {
                setImage(event.target.files[0]);
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        {/* Signup button */}
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-1"
          onClick={() => PostData()}
        >
          SignUp
        </button>
        <h5>
          <Link to="/signin">
            <h6>Already have an account?</h6>
          </Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
