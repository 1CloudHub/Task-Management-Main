import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

function CardList() {
  return (
    <div>
      <div className="row mt-1">
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
          <div className="card shadow rounded-0 mb-3">
            <div className="row ">
              <div className="col">
                {/* <FaUserAlt className="text-muted" /> */}
                icons
              </div>
              <div className="col-xs-9 col-sm-9">
                <div className="card-body center-align row">
                  <span className="">
                    <FaUserAlt className="text-muted" />
                  </span>
                  <div className="col">
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

                  <div className="col">
                    <h5 className="card-title">
                      <span
                        className="badge rounded"
                        style={{ background: "#4ed37d" }}
                      >
                        <TiTick /> Completed
                      </span>
                    </h5>
                    <p className="card-text mb-0">created by Rob</p>
                    <small className="text-muted mb-0">Assigned to Mani</small>
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
      </div>
    </div>
  );
}

export default CardList;
