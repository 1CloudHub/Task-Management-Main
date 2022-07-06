import React from "react";
import TableList from "./TableList";
import Footer from "./Footer";
import NavBar from "./Nav-bar";

function SearchList({ logoutClick, userDetails }) {
  return (
    <div>
      <div className="main ">
        <NavBar logoutClick={logoutClick} userDetails={userDetails} />

        <br />
        <div className="container main-container ">
          <TableList />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default SearchList;
