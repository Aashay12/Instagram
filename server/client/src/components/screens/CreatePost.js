import React, { useEffect, useState } from "react";

import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  //Set useState hooks
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  //Use effect helps in managing the workflow of the fucntions
  // Only after the url changes, it will post the data to the createpost route
  useEffect(() => {
    if (url) {
      //Post data to node Js backend to /createPost route
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        //Will stringify the response data
        body: JSON.stringify({
          title,
          body,
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
            M.toast({
              html: "Posted",
              classes: "#43a047 green darken-1",
            });

            //Redirect the user to signin page
            history.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [url]);

  //Fucntion to upload images to cloudinary
  const PostDetails = () => {
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

  return (
    <div className="card input-field post-card">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      ></input>
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
        }}
      ></input>
      <div className="file-field input-field">
        <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
          <span>Upload Photo</span>
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
      <button
        className="btn waves-effect waves-light #42a5f5 blue darken-1"
        onClick={() => PostDetails()}
      >
        Post
      </button>
    </div>
  );
};

export default CreatePost;
