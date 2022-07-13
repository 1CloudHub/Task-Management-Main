import React from "react";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";

function GoogleAuth() {
  const navigate = useNavigate();
  const loginSuccess = () => {
    // alert("success");
    navigate("/Dashboard");
  };
  return (
    <div className="d-flex justify-content-center align-items-center googlebutton">
      <div className="d-flex justify-content-center">
        {/* <GoogleOAuthProvider clientId="558355949896-4iqblbm56lvqs2fc997tqflv6bc29olp.apps.googleusercontent.com"></GoogleOAuthProvider> */}
        <GoogleLogin
          clientId={
            "558355949896-4iqblbm56lvqs2fc997tqflv6bc29olp.apps.googleusercontent.com"
            //Jothi Gave
            // "637570065678-jlt07711go3864ss5p118r3d73aedt1p.apps.googleusercontent.com"
            //svasti sample
            // "558355949896-8a99880dbov2s9gf6sa8318033f6n1vo.apps.googleusercontent.com"
          }
          buttonText={"Login Using Google"}
          // uxMode="redirect"
          // redirectUri={"http://localhost:3000/Dashboard"}
          cookiePolicy={"single_host_origin"}
          onSuccess={loginSuccess}
        />
      </div>
    </div>
  );
}

export default GoogleAuth;
