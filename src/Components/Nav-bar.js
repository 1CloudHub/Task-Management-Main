import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Button } from "bootstrap";
import React, { useEffect, useState } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  Button,
} from "react-bootstrap";
import { GoogleLogout } from "react-google-login";
import { AiFillEdit, AiFillFileAdd } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaHistory } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./Logout";

import { FiPieChart } from "react-icons/fi";
import { FaChartPie, FaList } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";

function NavBar({ logoutClick, handleChangeFileData }) {
  const navigateTo = useNavigate();
  const [url, setURL] = useState("");
  const logout = () => {
    navigateTo("/");
  };

  useEffect(() => {
    let urlString = console.log(window.location.pathname);
    setURL(urlString);
  }, []);

  let userDetails = localStorage.getItem("userDetail");
  userDetails = JSON.parse(userDetails);
  // console.log(userDetails);

  const [isMobileView, setIsMobileView] = useState(false);

  const navList = [
    {
      id: 1,
      itemName: "Dashboard",
      itemImage: <MdDashboard className="mb-1 " />,
      url: "/MyTask",
    },
    {
      id: 2,
      itemName: "Add Task",
      itemImage: <AiFillFileAdd className="mb-1" />,
      url: "/AddTask",
    },
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("enter press here! ");
      navigateTo("/SearchList");
    }
  };
  const [showGraphIcon, setShowGraphIcon] = useState(true);
  const fileUpload = () => {
    document.getElementById("fileAttach").click();
  };

  return (
    <div>
      <Navbar className="shadow" fixed="top" bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand>
            {window.location.pathname == "/MyTask" ? (
              <h6 className="ml-10 mt-2">
                {" "}
                <strong> :: MY TASKS </strong>{" "}
              </h6>
            ) : window.location.pathname == "/AddTask" ? (
              <h6 className="ml-10 mt-2">
                {" "}
                <strong>:: CREATE TASK</strong>{" "}
              </h6>
            ) : (
              <h6 className="ml-10 mt-2">
                <strong>:: MANAGE TASK</strong>{" "}
              </h6>
            )}
          </Navbar.Brand>
          <Navbar.Text className="show-mobile-icons">
            {window.location.pathname == "/MyTask" ? (
              //  onClick={scrollToGraph}
              showGraphIcon ? (
                <span className="mobile-icons">
                  <FiPieChart className="" />
                </span>
              ) : (
                <span className="mobile-icons">
                  <FaList />
                  {/* onClick={scrollToList} */}
                </span>
              )
            ) : window.location.pathname == "/AddTask" ? (
              <span className="mobile-icons cursor-pointer">
                <FaPaperclip onClick={fileUpload} />
                <input
                  type="file"
                  id="fileAttach"
                  className="d-none"
                  multiple
                  onChange={handleChangeFileData}
                />
              </span>
            ) : (
              <span className="mobile-icons cursor-pointer">
                <FaPaperclip onClick={fileUpload} />
                <input
                  type="file"
                  id="fileAttach"
                  className="d-none"
                  multiple
                  onChange={handleChangeFileData}
                />
              </span>
            )}
            <span className="mobile-icons">
              <FiSearch className="" />
            </span>
            &nbsp;
          </Navbar.Text>

          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            <Form className="d-flex">
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
              {/* <Button variant="outline-success">Search</Button> */}
            </Form>
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              {navList.map((item, index) => {
                return (
                  <>
                    <Nav.Link>
                      <Link to={item.url}>
                        {" "}
                        {item.itemImage}
                        <span className="m-1">{item.itemName}</span>
                      </Link>
                    </Nav.Link>
                  </>
                );
              })}

              <NavDropdown title={<CgProfile />} id="navbarScrollingDropdown">
                <NavDropdown.Item key="1">
                  {userDetails.username}
                </NavDropdown.Item>
                <NavDropdown.Item key="2">{userDetails.email}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item key="3">
                  <Logout logoutClick={logoutClick} />
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
