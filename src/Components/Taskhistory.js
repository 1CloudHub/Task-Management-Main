import React from "react";
import Footer from "./Footer";
import NavBar from "./Nav-bar";
import { FiSearch } from "react-icons/fi";
import TableList from "./TableList";

function Taskhistory({ logoutClick, userDetails }) {
  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      <br />
      <div className="main-container mb-4 container">
        <h5 className="themeColor"> Task History </h5>
        <div className="row">
          <div className="col"></div>
          <div className="col-xs-12 col-sm-5 col-md-5 ">
            <div className="">
              <label>Search Task ID</label>
              <div className="input-group mt-1">
                <input
                  type="text"
                  list="search"
                  className="form-control"
                  placeholder="enter task id"
                  aria-describedby="basic-addon2"
                />
                <datalist id="search">
                  <option>Deposit</option>
                  <option>Loan</option>
                  <option>Interest</option>
                  <option>Finance</option>
                </datalist>
                <div className="input-group-append">
                  <span
                    className="input-group-text cursor-pointer"
                    id="basic-addon2"
                  >
                    <FiSearch className="mt-1 mb-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>
        <div className="row mt-1">
          <div className="col"></div>
          <div className="col-md-10">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>
                    <strong>Category &nbsp;:</strong>{" "}
                  </td>
                  <td>{"Loan"} </td>
                  <td>
                    {" "}
                    <strong>Created by</strong> &nbsp;:{" "}
                  </td>
                  <td>{"Adam"} </td>
                  <td>
                    <strong>Created Date &nbsp;: </strong>
                  </td>
                  <td>{"08-March-2022"} </td>
                </tr>
                <tr>
                  <td>
                    <strong>Sub Category &nbsp;:</strong>{" "}
                  </td>
                  <td>{"Home Loan"} </td>
                  <td>
                    <strong>Current Status &nbsp;: </strong>
                  </td>
                  <td>{"Resolved"} </td>
                </tr>
                <tr>
                  <td>
                    <strong>Sub Sub Category &nbsp;</strong>{" "}
                  </td>
                  <td>{"Loan Request"} </td>
                  <td>
                    <strong>Assigned To &nbsp;:</strong>{" "}
                  </td>
                  <td>{"John"} </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col"></div>
        </div>
        <div className="row mb-5">
          <TableList columns={""} />
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
