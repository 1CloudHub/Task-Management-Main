import React from "react";
import {
  AiFillFacebook,
  AiFillLinkedin,
  AiOutlineCopyrightCircle,
} from "react-icons/ai";

const Footer = () => {
  const navList = [
    {
      itemName: "",
      itemImage: <AiFillFacebook className="mb-1 " />,
      // url: "/Dashboard",
    },
    {
      itemName: "",
      itemImage: <AiFillLinkedin className="mb-1" />,
      // url: "/AddTask",
    },
  ];
  return (
    <div>
      <div className="nav-bar container-fluid bg-theme-color shadow fixed-bottom">
        <div className="nav-container px-2 d-flex justify-content-between align-items-center m-0 ">
          <div className="nav-title">
            {/* <Link to="/Dashboard">
              <img
                src="1cloudhub-small-logo.jfif"
                className="nav-logo"
                alt="nav-svasti-logo"
              />
            </Link> */}
          </div>

          <div className=" ">
            <div className=" nav-items d-flex align-items-center ">
              <ul className="d-flex m-0 cursor-pointer  ">
                {navList.map((item) => {
                  return (
                    <>
                      <li className="px-2 " key={item.itemImage}>
                        {" "}
                        {item.itemName} &nbsp; {item.itemImage}
                      </li>
                    </>
                  );
                })}
                <li>
                  Copyright <AiOutlineCopyrightCircle className="mb-1" /> 2022
                  Company, Inc. All Rights Reserved.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
