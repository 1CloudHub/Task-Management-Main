import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import APIService from "../Services/APIService";
import Footer from "./Footer";
import NavBar from "./Nav-bar";

function Newtask({ logoutClick, userDetails }) {
  const [category, setCategory] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [subSubCategory, setSubSubCategory] = useState([]);
  const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);

  const [data, setData] = useState([]);
  const formref = useRef();

  const apiService = new APIService();
  let key = 0;
  useEffect(() => {
    apiService
      .request("category")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        let catgry = myJson;
        setCategory(catgry);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
    key = selectedValue.target.value;
    apiService
      .request("subcategory")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log("--subcat -- ", myJson);

        let values = myJson[key];
        setSubCategoryOptions(values);
        console.log("sub catgory option --", subCategoryOptions);
      })
      .catch((error) => {
        console.log(error);
      });
    setData((prevState) => ({ ...prevState, category: key }));
  };

  const handleSubCategoryChange = (e) => {
    console.log(e.target.value, subSubCategory);
    key = e.target.value;
    apiService
      .request("subsubcategory")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        let values = myJson[key];
        setSubSubCategoryOptions(values);
      })
      .catch((error) => {
        console.log(error);
      });
    setData((prevState) => ({ ...prevState, subCategory: key }));
  };
  const [chars_left, setCharLeft] = useState(125);

  const handleChangeData = ({ target: { name, value } }) => {
    setData((prevState) => ({ ...prevState, [name]: value }));
    const max_chars = 125;
    setCharLeft(max_chars - value.length);
  };

  const handleChangeFileData = ({ target: { name, files } }) => {
    setData((prevState) => ({ ...prevState, [name]: files[0] }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("---datax--");
    console.log("submit clicked", data);

    formref.current.reset();

    toast.success("Submitted Successfully");
  };

  return (
    <div className="main ">
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />

      <br />
      <div className="container main-container mb-5">
        <h5 className="themeColor"> Add New Task </h5>
        <form ref={formref} onSubmit={handleSubmit}>
          <div className="row ">
            <div className="col-xs-12 col-sm-12 col-md-6  ">
              <div className="mt-2">
                <label> Category </label>
                <select
                  name="category"
                  onChange={handleCategoryChange}
                  className="mt-2 form-control"
                >
                  <option value="">Choose..</option>
                  {category &&
                    category.map((item, index) => {
                      return (
                        <option key={index} value={item.value}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="mt-2 ">
                <label> Sub Category </label>
                <select
                  name="subcategory"
                  onChange={handleSubCategoryChange}
                  className="mt-2 form-control"
                >
                  <option value="">Choose..</option>
                  {subCategoryOptions &&
                    subCategoryOptions.map((item, index) => {
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
                  name="subsubcategory"
                  className="mt-2 form-control"
                  onChange={handleChangeData}
                >
                  <option value="">Choose..</option>
                  {subSubCategoryOptions &&
                    subSubCategoryOptions.map((item, index) => {
                      return (
                        <option key={index} value={item.value}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="mt-1">
                <label> Subject Line </label>

                <textarea
                  name="description"
                  onChange={handleChangeData}
                  className="form-control mt-1 "
                >
                  {" "}
                </textarea>
                <p className="charLeftClass">Characters Left: {chars_left}</p>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 ">
              <div className="mt-1">
                <label className="mt-1"> Relate to previous task </label>
                <div className="d-flex mt-1">
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
              {/* <MapComponent getLat={checkFun} /> */}
              <div className="mt-2">
                <label> Description </label>
                <textarea
                  name="description"
                  onChange={handleChangeData}
                  className="form-control mt-1 "
                >
                  {" "}
                </textarea>
                <p className="charLeftClass">Characters Left: {chars_left}</p>
              </div>

              <div className="mt-1">
                <label className="marginRight1 mt-2">
                  {" "}
                  Attach Document : &nbsp;
                  <input
                    type="file"
                    className="mt-2"
                    name="fileAttach"
                    onChange={handleChangeFileData}
                  />
                  {/* <Link to="#" className="mt-2">
                  {" "}
                  Relate to previous Task?
                </Link> */}
                </label>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col"></div>
            <div className="col-xs-4 col-lg-4 col-md-6 col-lg-5 mt-2 mb-5 ">
              <button
                type="submit"
                className="form-control  btn-clr submitButton"
              >
                {" "}
                Submit{" "}
              </button>
            </div>
            <div className="col"></div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default Newtask;
