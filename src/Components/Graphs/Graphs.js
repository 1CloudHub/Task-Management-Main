import React, { useEffect, useState } from "react";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";

function Graphs() {
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState({});
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [subSubCategory, setSubSubCategory] = useState([]);
  const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);

  useEffect(() => {
    fetch("data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        let catgry = myJson.category;
        setCategory(catgry);
        let subctgry = myJson.subCategory;
        setSubCategory(subctgry);
        let subsubctgry = myJson.subSubCategory;
        setSubSubCategory(subsubctgry);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  let key = 0;

  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value, subCategory);
    key = selectedValue.target.value;
    let values = subCategory[key];
    setSubCategoryOptions(values);
  };

  const handleSubCategoryChange = (e) => {
    console.log(e.target.value, subSubCategory);
    key = e.target.value;
    let values = subSubCategory[key];
    setSubSubCategoryOptions(values);
  };
  return (
    <div>
      <div className="container ">
        <div className="row">
          <div className=" col-sm-4 col-lg-4 col-md-4 col-xs-4">
            <label> Category </label>
            <select
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
          <div className=" col-sm-4 col-lg-4 col-md-4 col-xs-4">
            <label> Sub Category </label>
            <select
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
          <div className=" col-sm-4 col-lg-4 col-md-4 col-xs-4">
            <label> Sub Sub Category </label>
            <select className="mt-2 form-control">
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
        </div>
      </div>
      <br />
      <div className="row">
        <div className=" col-xs-6 col-sm-6 col-md-12 col-lg-6 ">
          <BarGraph />
        </div>
        <div className="col-xs-6 col-sm-6 col-md-12 col-lg-6 ">
          <PieChart />
        </div>
      </div>
    </div>
  );
}

export default Graphs;
