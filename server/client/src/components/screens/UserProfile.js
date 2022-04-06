/* eslint-disable jsx-a11y/alt-text */
//Create Profile page

import "../../App.css";

import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);

  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowfollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followid: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowfollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowid: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });

        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newfollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newfollower,
            },
          };
        });
        setShowfollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="profile-page">
          <div className="profile-pic" style={{ display: "flex" }}>
            <div>
              <img className="profile-img" src={userProfile.user.pic} />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <div className="profile-stats" style={{ display: "flex" }}>
                <h5> {userProfile.posts.length} Posts </h5>
                <h5> {userProfile.user.followers.length} Followers </h5>
                <h5> {userProfile.user.following.length} Following </h5>
              </div>
              {showfollow ? (
                <button
                  className="btn waves-effect waves-light #42a5f5 blue darken-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #42a5f5 blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
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
      ) : (
        <h2
          className=""
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          Loading...
        </h2>
      )}
    </>
  );
};

export default UserProfile;
