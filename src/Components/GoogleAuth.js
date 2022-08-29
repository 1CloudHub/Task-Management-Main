import { GoogleLogin } from "@react-oauth/google";
import React from "react";

import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

function GoogleAuth({ loginSuccess }) {
  const navigate = useNavigate();

  const loginFailure = (e) => {
    console.log("failure : ", e);
  };
  return (
    <>
      <div className="  googlebutton">
        <img src="/Images/login-bg.jpg" className="img-fluid" />
        <div className="d-flex justify-content-center align-items-center">
          <GoogleOAuthProvider clientId="637570065678-jlt07711go3864ss5p118r3d73aedt1p.apps.googleusercontent.com">
            <GoogleLogin onSuccess={loginSuccess} onFailure={loginFailure} />
          </GoogleOAuthProvider>
        </div>
      </div>
    </>
  );
}

export default GoogleAuth;
