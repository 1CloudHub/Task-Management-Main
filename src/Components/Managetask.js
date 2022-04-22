import React, { useState } from "react";
import Footer from "./Footer";
import NavBar from "./Nav-bar";
import { Link } from "react-router-dom";
import MapComponent from "./MapComponent";

function Managetask({ logoutClick, userDetails }) {
  const [selectedCategoryOption, setSelectedCategoryOption] = useState(null);
  const categoryOptions = [{ value: "Loan", label: "Loan" }];
  const handleCategoryOptionChange = (selectedValue) => {
    setSelectedCategoryOption(selectedValue);
  };
  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      <br />
      <div className="main-container mb-4 container">
        <h5 className="themeColor"> View Task </h5>
        <div className="row">
          <div className="col-xs-12 col-sm-5 col-md-5 ">
            <div className="mt-2">
              <label> Task ID </label>
              <input type="text" className="form-control" />
            </div>
            <div className="mt-2">
              <label> Category </label>
              <select
                value={categoryOptions}
                onChange={handleCategoryOptionChange}
                className="mt-1 form-control"
              >
                {categoryOptions.map((item) => {
                  return <option value={item.label}>{item.value}</option>;
                })}
              </select>
            </div>
            <div className="mt-2">
              <label> Sub Category </label>
              <select
                value={categoryOptions}
                onChange={handleCategoryOptionChange}
                className="mt-1 form-control"
              >
                {categoryOptions.map((item) => {
                  return <option value={item.label}>{item.value}</option>;
                })}
              </select>
            </div>
            <div className="mt-2">
              <label> Sub Sub Category </label>
              <select
                value={categoryOptions}
                onChange={handleCategoryOptionChange}
                className="mt-1 form-control"
              >
                {categoryOptions.map((item) => {
                  return <option value={item.label}>{item.value}</option>;
                })}
              </select>
            </div>
            <div className="mt-2">
              <label> Status </label>
              <input type="text" className="form-control" />
            </div>
            <div className="mt-2">
              <label> Last Status TimeStamp </label>
              <input type="text" className="form-control mt-1" />
            </div>
            <div className="mt-2">
              <label> Last Updated By </label>
              <input type="text" className="form-control mt-1" />
            </div>
            <div className="mt-2">
              <label>Created On </label>
              <input type="text" className="form-control mt-1" />
            </div>
            <div className="mt-2">
              <label> Documents </label>
              <div className="border mt-1">
                <ul> Doc1.pdf</ul>
                <ul> note.wav</ul>
              </div>
            </div>
            <div className="mt-2">
              <label> Notes </label>
              <textarea className="form-control mt-1 "> </textarea>
            </div>
            <div className="mt-2">
              <label> Created By </label>
              <input type="text" className="form-control mt-1" />
            </div>
          </div>
          <div className="col-md-1"></div>
          <div className="col-xs-12 col-sm-5 col-md-5  ">
            <div className="mt-2">
              <label> Subject </label>
              <input type="text" className="form-control" />
            </div>
            <div className="mt-2">
              <label> Description</label>
              <input type="text" className="form-control mt-1" />
            </div>
            <div className="mt-2">
              <label> Link to Previous </label>
              <input type="text" className="form-control mt-1" />
            </div>
            <div className="mt-2">
              <label> Assigned To </label>
              <input type="text" className="form-control mt-1" />
            </div>
            <div className="mt-2">
              <label> ETA </label>
              <input type="text" className="form-control mt-1" />
            </div>
            <div className="mt-2">
              {/* <Link to="/taskhistory"> */}
              <p>
                <u>
                  <em>View History ?</em>
                </u>
              </p>
            </div>

            <div className="mt-2">
              <div className="mt-1">
                <MapComponent />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col"></div>
          <div className="col-xs-4 col-lg-4 col-md-6 col-lg-5 mt-2 mb-5 ">
            <button className="form-control  btn-clr submitButton">
              {" "}
              Submit{" "}
            </button>
          </div>
          <div className="col"></div>
        </div>

        <br />
        <br />
      </div>
      <br />

      <Footer />
    </div>
  );
}

export default Managetask;
