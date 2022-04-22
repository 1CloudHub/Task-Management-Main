import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import MapComponent from "./MapComponent";
import NavBar from "./Nav-bar";

function Newtask({ logoutClick, userDetails }) {
  const [selectedCategoryOption, setSelectedCategoryOption] = useState(null);
  const categoryOptions = [{ value: "Loan", label: "Loan" }];
  const handleCategoryOptionChange = (selectedValue) => {
    setSelectedCategoryOption(selectedValue);
  };
  return (
    <div className="main ">
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />

      <br />
      <div className="container main-container mb-5">
        <h5 className="themeColor"> Add New Task </h5>

        <div className="row ">
          <div className="col-xs-12 col-sm-12 col-md-4  ">
            <div className="mt-2">
              <label> Category </label>
              <select
                value={categoryOptions}
                onChange={handleCategoryOptionChange}
                className="mt-1  form-control"
              >
                {categoryOptions.map((item) => {
                  return <option value={item.label}>{item.value}</option>;
                })}
              </select>
            </div>
            <div className="mt-2 ">
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
            <div className="mt-1">
              <label> Subject Line </label>
              <input type="text" className="form-control mt-1 " />
            </div>
            <div className="mt-1">
              <label> Description </label>
              <textarea className="form-control mt-1 "> </textarea>
            </div>
            <div className="mt-1">
              <label> Relate to previous task </label>
              <input type="text" className="form-control" />
            </div>
            <div className="mt-1">
              <label className="marginRight1 mt-2">
                {" "}
                Attach Document : &nbsp;
                <input type="file" className="mt-2" />
                <Link to="#" className="mt-2">
                  {" "}
                  Relate to previous Task?
                </Link>
              </label>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-8 ">
            <MapComponent />
          </div>
        </div>
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
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default Newtask;
