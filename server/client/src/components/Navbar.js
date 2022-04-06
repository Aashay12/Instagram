import { Link, useHistory } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";

import M from "materialize-css";
import { UserContext } from "../App";

//Create a functional component for navbar
const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const searchModal = useRef(null);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const renderList = () => {
    if (state) {
      return [
        <li key={"5"}>
          <Link to="/">
            <i data-target="modal1" className="material-icons modal-trigger">
              search
            </i>
          </Link>
        </li>,
        <li key={"0"}>
          <Link to="/">My Feed</Link>
        </li>,
        <li key={"1"}>
          <Link to="/myfeed">Explore</Link>
        </li>,
        <li key={"2"}>
          <Link to="/profile">Profile</Link>
        </li>,
        <li key={"3"}>
          <Link to="/createpost">Post</Link>
        </li>,
        <li key={"4"}>
          <button
            className="btn waves-effect waves-light #42a5f5 blue darken-1"
            style={{ marginLeft: "20px" }}
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
              M.toast({
                html: "Logged Out Successfully",
                classes: "#43a047 green darken-1",
              });
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key={"3"}>
          <Link to="/signin">Signin</Link>
        </li>,
        <li key={"4"}>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/searchUser", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper white" style={{ padding: "0px 10px" }}>
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="Search User"
            value={search}
            onChange={(event) => fetchUsers(event.target.value)}
          />
          <div className="collection" style={{ color: "black" }}>
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("   n");
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => {
              setSearch(" ");
            }}
          >
            Close
          </a>
        </div>
      </div>
    </nav>
  );
};

//export the navbar component
export default NavBar;
