import React from "react";
import { GoogleLogout } from "react-google-login";

function Logout({ logoutClick }) {
  return (
    <div>
      <div className=" ">
        <GoogleLogout
          clientId={
            "558355949896-4iqblbm56lvqs2fc997tqflv6bc29olp.apps.googleusercontent.com"
          }
          render={(props) => (
            <p
              className="px-3 py-1 mb-1 border-0 logout-button"
              onClick={props.onClick}
            >
              Logout
            </p>
          )}
          cookiePolicy={"single_host_origin"}
          onLogoutSuccess={logoutClick}
        />
      </div>
    </div>
  );
}

export default Logout;
