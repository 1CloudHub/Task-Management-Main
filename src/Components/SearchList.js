import React from "react";
import TableList from "./TableList";
import Footer from "./Footer";
import NavBar from "./Nav-bar";
import { FaUserAlt, FaCircle } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { Card } from "react-bootstrap";

function SearchList({ logoutClick, userDetails }) {
  const size = [1, 1, 1, 1, 1, 1];
  return (
    <div>
      <div className="main ">
        <NavBar logoutClick={logoutClick} userDetails={userDetails} />
        <br />

        <div className="container main-container mb-5">
          <h5 className="themeColor"> Search </h5>
          {size.map((index) => {
            return (
              <>
                <div key={index}>
                  {/* <Card className="p-2">
                    <div>
                      {" "}
                      <b> Loan </b>
                    </div>
                    <div> John</div>
                    <div> 27th June 2022 </div>
                    <div>
                      <FaCircle style={{ color: "green", float: "right" }} />
                    </div>
                  </Card> */}
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
              </>
            );
          })}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default SearchList;
