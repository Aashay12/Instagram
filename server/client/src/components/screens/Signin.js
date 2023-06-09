//Create Login page

import { Link, useHistory } from "react-router-dom";
import React, { useContext, useState } from "react";

import M from "materialize-css";
import { UserContext } from "../../App.js";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  //Send a network request to fetch the data when the user clicks on signup button
  const PostData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      //Will stringify the response data
      body: JSON.stringify({
        password,
        email,
      }),
    })
      //If we do get a resonspe, convert it to json format
      .then((res) => res.json())
      .then((data) => {
        //Catch the acutal data recived from the backend
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          //Save the token to local storage
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "Signed In Successfully",
            classes: "#43a047 green darken-1",
          });
          // console.log(data.user, data.token);
          //Redirect the user to signin page
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="myCard ">
      <div className="card auth-card input-field ">
        <h2 className="card-logo">Instagram</h2>
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
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-1"
          onClick={() => PostData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Dont have an account yet?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
