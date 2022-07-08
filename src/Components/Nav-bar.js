import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { GoogleLogout } from "react-google-login";
import { AiFillEdit, AiFillFileAdd } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaHistory } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./Logout";
function NavBar({
  logoutClick,
  userDetails = { username: "user", email: "email@1cloudhub.com" },
}) {
  const navigateTo = useNavigate();
  const logout = () => {
    navigateTo("/");
  };

  const [isMobileView, setIsMobileView] = useState(false);

  const navList = [
    {
      id: 1,
      itemName: "Dashboard",
      itemImage: <MdDashboard className="mb-1 " />,
      url: "/Dashboard",
    },
    {
      id: 2,
      itemName: "Add Task",
      itemImage: <AiFillFileAdd className="mb-1" />,
      url: "/AddTask",
    },
    // {
    //   id: 3,
    //   itemName: "View/Edit Task",
    //   itemImage: <AiFillEdit className="mb-1" />,
    //   url: "/ManageTask",
    // },
    {
      id: 4,
      itemName: "Task History",
      itemImage: <FaHistory className="mb-1" />,
      url: "/TaskHistory",
    },
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("enter press here! ");
      navigateTo("/SearchList");
    }
  };

  return (
    <div>
      <div className="nav-bar container-fluid bg-theme-color shadow fixed-top">
        <div className="nav-container px-2 d-flex justify-content-between align-items-center m-0 ">
          <div className="nav-title">
            <Link to="/Dashboard">
              <img
                // src="1cloudhub-small-logo.jfif"
                src="svasti_navlogo-nobg.png"
                className="nav-logo"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="mobile-view">
            <button
              className="border-0 p-2 rounded "
              onClick={() => setIsMobileView(!isMobileView)}
            >
              {isMobileView ? (
                // <AiFillCloseCircle />
                <FontAwesomeIcon className="px-1" icon={faXmark} />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </button>
          </div>

          <div className="nav-sub-links-sm ">
            <div className=" nav-items d-flex align-items-center ">
              <ul
                className={
                  isMobileView
                    ? "d-flex m-0 cursor-pointer nav-ul-mobile "
                    : "d-flex m-0 cursor-pointer nav-ul-lg logout"
                }
              >
                <li>
                  {/* <div class="input-group ">
                    <input
                      type="text"
                      class="form-control search-bar"
                      placeholder="search ..."
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                    />
                    <div class="input-group-append search-bar rounded">
                      <span class="input-group-text" id="basic-addon2">
                        <FiSearch className="mt-1 mb-1" />
                      </span>
                    </div>
                  </div> */}
                  <div className="input-group ">
                    <input
                      type="text"
                      list="search"
                      className="form-control search-bar"
                      placeholder="search "
                      aria-describedby="basic-addon2"
                      onKeyDown={handleSearch}
                    />
                    <span
                      className="input-search-text cursor-pointer"
                      id="basic-addon2"
                    >
                      <FiSearch className="mt-1 mb-1" />
                    </span>
                  </div>
                  <datalist id="search">
                    <option>Deposit</option>
                    <option>Loan</option>
                    <option>Interest</option>
                    <option>Finance</option>
                  </datalist>
                  {/* <div className="input-group-append">
                      <span
                        className="input-search-text cursor-pointer"
                        id="basic-addon2"
                      >
                        <FiSearch className="mt-1 mb-1" />
                      </span>
                    </div>
                  </div> */}
                </li>
                {navList.map((item, index) => {
                  return (
                    <>
                      <Link to={item.url}>
                        <li className="px-2 " key={index}>
                          {" "}
                          {item.itemImage}
                          {item.itemName}
                        </li>
                      </Link>
                    </>
                  );
                })}
              </ul>
              <NavDropdown
                title={<CgProfile />}
                className={
                  isMobileView
                    ? "d-flex m-0 cursor-pointer nav-ul-mobile pb-4 logout"
                    : "d-flex m-0 cursor-pointer nav-ul-lg "
                }
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item key="1">
                  {userDetails.username}User
                </NavDropdown.Item>
                <NavDropdown.Item key="2">
                  {userDetails.email}user@1cloudhub.com
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item key="3">
                  {/* onClick={logout} */}
                  {/* Logout */}
                  <Logout logoutClick={logoutClick} />
                  {/* <GoogleLogout
                    buttonText="Logout"
                    onLogoutSuccess={logout}
                  ></GoogleLogout> */}
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
