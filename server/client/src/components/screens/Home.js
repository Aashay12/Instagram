/* eslint-disable jsx-a11y/alt-text */
//Create the main home page

import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { UserContext } from "../../App.js";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  //This will only load the function once, when the component is mounted
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setData(result.posts);
      });
  }, []);

  //Request to update likes
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //To return the updated number of likes
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Request to update dislikes
  const dislikePost = (id) => {
    fetch("/dislike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Request to add comments
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Request to delete posts
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="home-page">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <div className="card-image" style={{ padding: "10px" }}>
              <img src={item.photo} />
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  onClick={() => deletePost(item._id)}
                  style={{ float: "right", padding: "20px 10px 10px 10px" }}
                >
                  delete
                </i>
              )}
            </div>
            <div className="card-content" style={{ padding: "10px" }}>
              <strong>
                <h5 style={{ marginBottom: "10px", marginTop: "0px" }}>
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                  >
                    {item.postedBy.name}
                  </Link>
                </h5>
              </strong>
              <i className="material-icons like-icon">favorite</i>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    dislikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  style={{ marginLeft: "20px" }}
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}

              <h6>{item.likes.length} Likes</h6>
              <h6>
                <strong>{item.title}</strong>
              </h6>
              <p>{item.body}</p>
              <h6 style={{ fontWeight: "500", color: "grey" }}>Comments</h6>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>
                    :{" " + record.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="Add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
