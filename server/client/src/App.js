import "./App.css";

import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { initialState, reducer } from "./reducers/userReducer.js";

import CreatePost from "./components/screens/CreatePost.js";
import Home from "./components/screens/Home.js";
import Myfeed from "./components/screens/SubscribedPosts.js";
import NavBar from "./components/Navbar.js";
import Profile from "./components/screens/Profile.js";
import Signin from "./components/screens/Signin.js";
import Signup from "./components/screens/Signup.js";
import UserProfile from "./components/screens/UserProfile.js";

export const UserContext = createContext();

const Routing = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfeed">
        <Myfeed />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
