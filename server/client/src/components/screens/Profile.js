/* eslint-disable jsx-a11y/alt-text */
//Create Profile page

import "../../App.css";

import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../../App.js";

const Profile = () => {
  const [mypics, setPic] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  // const [url, setUrl] = useState("");

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
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
          // setUrl(data.url);

          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              // window.location.reload();
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div className="profile-page">
      <div style={{ margin: "18px 0px", borderBottom: "1px solid grey" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img className="profile-img" src={state ? state.pic : "Loading"} />
          </div>
          <div style={{ margin: "10px" }}>
            <h4>{state ? state.name : "Loading"}</h4>
            <div
              className="profile-stats"
              style={{ display: "flex", width: "130%" }}
            >
              <h5> {mypics.length} Posts </h5>
              <h5> {state ? state.followers.length : "0"} Followers </h5>
              <h5> {state ? state.following.length : "0"} Following </h5>
            </div>
          </div>
          <div className="file-field input-field">
            <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
              <span>Edit Image</span>
              <input
                type="file"
                onChange={(event) => {
                  updatePhoto(event.target.files[0]);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              className="item"
              src={item.photo}
              alt={item.title}
              key={item._id}
            ></img>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
