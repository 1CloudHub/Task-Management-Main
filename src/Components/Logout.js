import React from "react";
import { googleLogout } from "@react-oauth/google";

function Logout({ logoutClick }) {
  return (
    <div onClick={logoutClick}>
      <div className=" ">
        <a>Logout</a>
      </div>
    </div>
  );
}

export default Logout;
