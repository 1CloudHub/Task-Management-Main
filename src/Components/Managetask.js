import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIService from "../Services/APIService";
import Footer from "./Footer";
import MapComponent from "./MapComponent";
import NavBar from "./Nav-bar";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

function Managetask({ logoutClick, userDetails }) {
  let { id } = useParams();
  const [userDetail, setUserDetail] = useState([]);
  console.log(id);
  const apiService = new APIService();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subSubCategory, setSubSubCategory] = useState([]);
  const [defCat, setDefCat] = useState([]);
  const [defSubCat, setDefSubCat] = useState([]);
  const [defSubSubCat, setDefSubSubCat] = useState([]);

  const handleCategoryChange = (e) => {
    console.log(e.target.value);
    setDefCat(e.target.value);
    let key = e.target.value;
    apiService
      .request("subCategory")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setSubCategory(myJson[key]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubCategoryChange = (e) => {
    console.log(e.target.value);
    let key = e.target.value;
    setDefSubCat(e.target.value);
    apiService
      .request("subSubCategory")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setSubSubCategory(myJson[key]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubSubCategoryChange = (e) => {
    setDefSubSubCat(e.target.value);
  };
  let catgry = "";
  let subCategry = "";
  useEffect(() => {
    apiService
      .request("1")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log("--1---", myJson);
        setUserDetail(myJson);
        console.log(userDetail);
        catgry = myJson.category;
        console.log(catgry);
        subCategry = myJson.subCategory;
        setDefCat(myJson.category);
      })
      .catch((error) => {
        console.log(error);
      });
    apiService
      .request("category")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setCategoryOptions(myJson);
      })
      .catch((error) => {
        console.log(error);
      });
    apiService
      .request("subCategory")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        console.log(catgry);
        let cat = myJson[catgry];
        console.log(cat);
        setSubCategory(cat);
      })
      .catch((error) => {
        console.log(error);
      });
    apiService
      .request("subSubCategory")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        console.log(catgry);
        let cat = myJson[subCategry];
        console.log(cat);
        setSubSubCategory(cat);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const docs = [
    {
      uri: "https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ",
    }, // Local File
  ];

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
              <input
                type="text"
                className="form-control"
                value={userDetail.taskId}
                disabled={true}
              />
            </div>
            <div className="mt-2">
              <label> Category </label>
              <select
                onChange={handleCategoryChange}
                className="mt-1 form-control"
                value={defCat}
              >
                {categoryOptions.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mt-2">
              <label> Sub Category </label>
              <select
                onChange={handleSubCategoryChange}
                className="mt-1 form-control"
                value={defSubCat}
              >
                {subCategory &&
                  subCategory.map((item, index) => {
                    return (
                      <option key={index} value={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="mt-2">
              <label> Sub Sub Category </label>
              <select
                onChange={handleSubSubCategoryChange}
                className="mt-1 form-control"
                value={defSubSubCat}
              >
                {subSubCategory &&
                  subSubCategory.map((item, index) => {
                    return (
                      <option key={index} value={item.value}>
                        {item.name}
                      </option>
                    );
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
                <DocViewer
                  pluginRenderers={DocViewerRenderers}
                  documents={docs}
                />
                {/* <ul> Doc1.pdf</ul>
                <ul> note.wav</ul> */}
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
