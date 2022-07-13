import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Button } from "bootstrap";
import React, { useState } from "react";
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
      <Navbar className="shadow" fixed="top" bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">
            <Link to="/Dashboard">
              <img
                src="svasti_navlogo-nobg.png"
                className="nav-logo"
                alt="Logo"
              />
            </Link>
          </Navbar.Brand>
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
                    <Nav.Link href="/">
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
                  {userDetails.username}User
                </NavDropdown.Item>
                <NavDropdown.Item key="2">
                  {userDetails.email}user@1cloudhub.com
                </NavDropdown.Item>
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
