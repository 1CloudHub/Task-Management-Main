import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import React, { useEffect, useState } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-datepicker/dist/react-datepicker.css";
import GoogleLogin from "react-google-login";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import GoogleAuth from "./Components/GoogleAuth";
import Login from "./Components/Login";
import Managetask from "./Components/Managetask";
import Newtask from "./Components/Newtask";
import SearchList from "./Components/SearchList";
import Taskhistory from "./Components/Taskhistory";
import { useQuery, gql } from "@apollo/client";

const GETUSERIDBBYEMAIL_QUERY = gql`
  query USERIDBYEMAIL($emailAddress: String!) {
    getUser(emailAddress: $emailAddress) {
      userId
      emailAddress
    }
  }
`;

function App() {
  const navigate = useNavigate();
  const [currentURL, setCurrentUrl] = useState("");

  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    userId: "",
  });
  useEffect(() => {
    setCurrentUrl(window.location.pathname);
  }, []);

  const loginSuccess = (e) => {
    console.log(e);
    setUserDetails({
      username: e.profileObj.givenName,
      email: e.profileObj.email,
    });
    console.log(userDetails);
    localStorage.setItem("userDetail", JSON.stringify(userDetails));
    // setIsLoginSuccess(true);
    if (currentURL === "/") {
      navigate("/MyTask");
    } else {
      navigate(currentURL);
    }
  };
  const getUserIDbyEmail = useQuery(GETUSERIDBBYEMAIL_QUERY, {
    variables: {
      emailAddress: "raja.s@newgen.co",
      // emailAddress:userName.email
    },
  });
  console.log(getUserIDbyEmail);
  let userId = getUserIDbyEmail.data && getUserIDbyEmail.data.getUser.userId;

  localStorage.setItem("userId", userId);

  const onLogoutSuccess = () => {
    navigate("/");
  };
  const onFailure = (e) => {
    console.log("failure", e);
  };

  const [isloginSuccess, setIsLoginSuccess] = useState(true); //changed this to true for non google login page
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  return (
    <>
      {isloginSuccess ? (
        <Routes>
          <Route
            path="/"
            exact
            element={<GoogleAuth loginSuccess={loginSuccess} />}
          />
          {/* <Route path="/" exact element={<Login />} /> */}
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
      ) : (
        <>
          <div className=" d-flex justify-content-center align-items-center googlebutton">
            <div className="">
              {showLogoutMessage ? (
                <>
                  <h5 className="mb-3 text-white">
                    <strong>
                      <span className="">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                      &nbsp; &nbsp;{userDetails.username}
                    </strong>{" "}
                    &nbsp;
                    <em>logged Out Successfully , Login Again ?</em>
                  </h5>
                </>
              ) : (
                <>
                  <h5 className="mb-3 text-center text-white">
                    You are not Signed In , Login using Google to continue. . .
                  </h5>
                </>
              )}

              <div className="d-flex justify-content-center">
                <GoogleLogin
                  className=""
                  clientId={
                    "558355949896-4iqblbm56lvqs2fc997tqflv6bc29olp.apps.googleusercontent.com"
                    //Jothi Gave
                    // "637570065678-jlt07711go3864ss5p118r3d73aedt1p.apps.googleusercontent.com"
                  }
                  buttonText={"Click here to Login "}
                  // uxMode="redirect" // redirectUri={"http://localhost:3000/Dashboard"}
                  cookiePolicy={"single_host_origin"}
                  onSuccess={loginSuccess}
                  isSignedIn={true}
                  onFailure={onFailure}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </>
  );
}

export default App;
