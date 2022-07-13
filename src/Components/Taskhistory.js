import React from "react";
import Footer from "./Footer";
import NavBar from "./Nav-bar";
import { FiSearch } from "react-icons/fi";
import TableList from "./TableList";
import { FaUserAlt } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { HiClock } from "react-icons/hi";
import { BsClockHistory } from "react-icons/bs";
import { CgSandClock } from "react-icons/cg";

function Taskhistory({ logoutClick, userDetails }) {
  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      <br />
      <div className="main-container mb-4 container">
        <h5 className="themeColor"> Task History </h5>
        <br />
        <div className="row">
          <div className="col"></div>
          <div className="col-xs-12 col-sm-5 col-md-5 "></div>
          <div className="col"></div>
        </div>
        <div className="row mt-1">
          <div className="col"></div>
          <div className="col-md-10">
            <div className="card shadow rounded-0 mb-3">
              <div className="row no-gutters">
                <div className="col-md-3 p-3 d-flex justify-content-center align-items-center">
                  <FaUserAlt
                    className="text-muted"
                    style={{ fontSize: "60px" }}
                  />
                </div>
                <div className="col-xs-12 col-md-9 col-sm-12 col-lg-9">
                  <div className="card-body center-align row">
                    <div className="col-xs-6 col-sm-6 col-md-6 ">
                      <h5 className="card-title">EGH1034</h5>
                      <h6 className="card-title">John Smith</h6>
                      <div>
                        <small className=" text-muted mb-0">
                          Category : Loan
                        </small>
                      </div>
                      <div>
                        <small className=" text-muted mb-0">
                          Subject : Home Loan
                        </small>
                      </div>
                      <div className="text-muted mb-0">
                        <small>Sub Sub Category : House</small>
                      </div>
                    </div>

                    <div className="col-xs-6 col-sm-6 col-md-6">
                      <h5 className="card-title">
                        <span
                          className="badge rounded"
                          style={{ background: "#4ed37d" }}
                        >
                          <TiTick /> Completed
                        </span>
                      </h5>
                      <p className="card-text mb-0">created by Rob</p>
                      <small className="text-muted mb-0">
                        Assigned to Mani
                      </small>
                      <p className="card-text">
                        <small className="text-muted">
                          created on June 3rd 2022
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>

        <br />
        <div className=" mb-5">
          <div className="row">
            <div className="col-sm-2 col-md-6 col-lg-3">
              <div className=" ">
                <div className="card shadow rounded-0">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ padding: "10px 10px" }}
                  >
                    <TiTick
                      className="text-muted"
                      style={{ fontSize: "50px" }}
                    />
                  </div>

                  <div className="card-body text-center">
                    <h6 className="card-title">TAT Status</h6>
                    <h3 className="card-text text-muted pb-3">Completed</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-2 col-md-6 col-lg-3">
              <div className="">
                <div className="card shadow rounded-0">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ padding: "10px 10px" }}
                  >
                    <HiClock
                      className="text-muted"
                      style={{ fontSize: "50px" }}
                    />
                  </div>

                  <div class="card-body text-center">
                    <h6 class="card-title">Time Stamp</h6>
                    <h5 class="card-text text-muted pb-0">
                      07 July 2022 09:07:34AM
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-2 col-md-6 col-lg-3">
              <div className="">
                <div className="card shadow rounded-0">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ padding: "10px 10px" }}
                  >
                    <CgSandClock
                      className="text-muted"
                      style={{ fontSize: "50px" }}
                    />
                  </div>

                  <div className="card-body text-center">
                    <h6 className="card-title">Task Status</h6>
                    <h3 className="card-text text-muted pb-3">Pending</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-2 col-md-6 col-lg-3">
              <div className="">
                <div className="card shadow rounded-0">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ padding: "10px 10px" }}
                  >
                    <HiClock
                      className="text-muted"
                      style={{ fontSize: "50px" }}
                    />
                  </div>

                  <div className="card-body text-center">
                    <h6 className="card-title">TAT Inception</h6>
                    <h3 className="card-text text-muted pb-3">09:07:34</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <TableList columns={""} /> */}
        </div>
      </div>
      <br />
      <br />
      <div className="mb-5"></div>
      <Footer />
    </div>
  );
}

export default Taskhistory;
