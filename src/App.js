import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import GoogleAuth from "./Components/GoogleAuth";
import Managetask from "./Components/Managetask";
import Newtask from "./Components/Newtask";
import SearchList from "./Components/SearchList";
import Taskhistory from "./Components/Taskhistory";
import { Client, Config } from "./Services/HeadersConfig";
import { GETUSERIDBBYEMAIL_QUERY } from "./Services/Query";
function App() {
  console.log(process.env);
  const navigate = useNavigate();
  const [currentURL, setCurrentUrl] = useState("");
  const authenticateURL = process.env.REACT_APP_AUTHENTICATE_URL;
  const [isloginSuccess, setIsLoginSuccess] = useState(false); //changed this to true for non google login page
  const client = Client;
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    setCurrentUrl(window.location.pathname);
    const checkLogin = localStorage.getItem("userDetails");
    console.log("checkLogin :: ", checkLogin);
    if (checkLogin == null) {
      setIsLoginSuccess(false);
    } else {
      setIsLoginSuccess(true);
    }
  }, []);

  const loginSuccess = (e) => {
    // alert("login success  ");
    console.log("loginSuccess : ", e);
    var cred = e.credential;
    setUserDetails(e);
    localStorage.setItem("userDetails", e);
    var decoded = jwt_decode(cred);
    console.log("decoded : ", decoded);
    console.log("givenName : ", decoded.given_name);
    console.log("email : ", decoded.email);
    localStorage.setItem("userName", decoded.given_name);
    localStorage.setItem("email", decoded.email);
    localStorage.setItem("tokenId", e.credential);
    setIsLoginSuccess(true);
    // auth APIcall

    // auth API call

    // if (currentURL === "/") {
    console.log("inside if of current URL : ");
    axios
      .post(authenticateURL, "", {
        headers: {
          "Accept-Encoding": "gzip,deflate,br",
          Connection: "keep-alive",
          "Authentication-token": e.credential,
          "Access-Control-Allow-Origin": "*",
        },
      })
      // .then((response) => {})
      .then((response) => {
        console.log("auth api response : ", response);
        localStorage.setItem("jwt-token", response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    client
      .query({
        query: GETUSERIDBBYEMAIL_QUERY,
        variables: {
          emailAddress: localStorage.getItem("email"),
        },
      })
      .then((response) => {
        let userId = response.data && response.data.getUser.userId;
        console.log("userId : ", userId);
        localStorage.setItem("userId", userId);
        navigate("/MyTask");
      })
      .catch((err) => console.error(err));
    // } else {
    //   navigate(currentURL);
    // }
  };

  const onLogoutSuccess = () => {
    // alert("logout called");
    setUserDetails({});
    setIsLoginSuccess(false);
    localStorage.clear();
    navigate("/");
  };
  const onFailure = (e) => {
    alert("login failed >>", e);
  };

  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  return (
    <>
      {isloginSuccess ? (
        <>
          <Routes>
            <Route
              path="/"
              exact
              element={<GoogleAuth loginSuccess={loginSuccess} />}
            />
            <Route
              path="/MyTask"
              exact
              element={
                <Dashboard
                  logoutClick={onLogoutSuccess}
                  userDetails={userDetails}
                />
              }
            />
            <Route
              path="/AddTask"
              exact
              element={
                <Newtask
                  logoutClick={onLogoutSuccess}
                  userDetails={userDetails}
                />
              }
            />
            <Route
              path="/TaskHistory"
              exact
              element={
                <Taskhistory
                  logoutClick={onLogoutSuccess}
                  userDetails={userDetails}
                />
              }
            />
            <Route
              path="/ManageTask/:id"
              exact
              element={
                <Managetask
                  logoutClick={onLogoutSuccess}
                  userDetails={userDetails}
                />
              }
            />
            <Route
              path="/ManageTask/"
              exact
              element={
                <Managetask
                  logoutClick={onLogoutSuccess}
                  userDetails={userDetails}
                />
              }
            />
            <Route
              path="/SearchList"
              exact
              element={
                <SearchList
                  logoutClick={onLogoutSuccess}
                  userDetails={userDetails}
                />
              }
            />
          </Routes>
        </>
      ) : (
        <GoogleAuth loginSuccess={loginSuccess}></GoogleAuth>
      )}

      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
