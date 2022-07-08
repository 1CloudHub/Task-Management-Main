import React from "react";
import { GoogleLogout } from "react-google-login";

function Logout({ logoutClick }) {
  return (
    <div>
      <div className=" ">
        <GoogleLogout
          clientId={
            "558355949896-4iqblbm56lvqs2fc997tqflv6bc29olp.apps.googleusercontent.com"
            // Jothi Gave
            // "637570065678-jlt07711go3864ss5p118r3d73aedt1p.apps.googleusercontent.com"
          }
          render={() => (
            <p
              className="px-3 py-1 mb-1 border-0 logout-button"
              onClick={logoutClick}
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
