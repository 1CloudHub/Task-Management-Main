import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIService from "../Services/APIService";
import Footer from "./Footer";
import MapComponent from "./MapComponent";
import NavBar from "./Nav-bar";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { AiFillEdit } from "react-icons/ai";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";

const VIEW_TASK_QUERY = gql`
  query VIEWTASK($taskId: ID!) {
    getTask(taskId: $taskId) {
      taskId
      taskGroupId
      categoryId
      createdDate {
        formatString(format: "dd/MM/yyyy")
      }
      subCategoryId
      subSubCategoryId
      title
      resolution
      currentAssignee
      createdBy
      resolvedBy
      statusName
      currentAssigneeName
      createdByName
      resolvedDate {
        formatString(format: "dd/MM/yyyy")
      }
      dueDate {
        formatString(format: "dd/MM/yyyy")
      }
      status
      description
    }
  }
`;

const CATEGORY_LIST_QUERY = gql`
  query CategoryList {
    getCategories {
      categoryId
      name
    }
  }
`;

const SUB_CATEGORY_BY_CATEGORYID_QUERY = gql`
  query GETSUBCATEGORYLIST($categoryId: Int!) {
    getSubCategoriesByCategoryId(categoryId: $categoryId) {
      subCategoryId
      name
    }
  }
`;

const SUB_SUB_CATEGORY_BY_CATEGORYID_QUERY = gql`
  query GETSUBSUBCATEGORYLIST($subCategoryId: Int!) {
    getSubSubCategoriesBySubCategoryId(subCategoryId: $subCategoryId) {
      subCategoryId
      name
    }
  }
`;

function Managetask({ logoutClick, userDetails }) {
  let { id } = useParams();
  const [userDetail, setUserDetail] = useState([]);
  console.log(id);
  let taskId = parseInt(id);

  const response = useQuery(VIEW_TASK_QUERY, {
    variables: { taskId: taskId },
  });
  const viewTaskValues = response.data;
  console.log(viewTaskValues);
  let categoryId =
    viewTaskValues && parseInt(viewTaskValues.getTask.categoryId);
  console.log(categoryId);
  // to get categoryList
  const getCategoryList = useQuery(CATEGORY_LIST_QUERY);
  console.log("getCategoryList", getCategoryList);

  // to get subcategory list
  const getSubCategoryList = useQuery(SUB_CATEGORY_BY_CATEGORYID_QUERY, {
    variables: {
      categoryId: categoryId,
    },
  });
  console.log("getSubCategoryList --", getSubCategoryList);

  let subCategoryId =
    viewTaskValues && parseInt(viewTaskValues.getTask.subCategoryId);

  const getSubSubCategoryList = useQuery(SUB_CATEGORY_BY_CATEGORYID_QUERY, {
    variables: {
      subCategoryId: subCategoryId,
    },
  });

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
  const [startDate, setStartDate] = useState("");
  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      <br />
      <div className="main-container mb-4 container">
        <h5 className="themeColor">
          {" "}
          View Task / Edit Task &nbsp;
          {/* <span title="edit" className="assignbutton">
            <AiFillEdit />
          </span> */}
        </h5>

        <div className="row">
          <div className="col-xs-12 col-sm-5 col-md-5 ">
            <div className="mt-2">
              <label> Task ID </label>
              <div>{viewTaskValues && viewTaskValues.getTask.taskId}</div>
            </div>
            <div className="mt-2">
              <label> Category </label>
              <select
                // onChange={handleCategoryChange}
                className="mt-1 form-control"
              >
                {getCategoryList.data &&
                  getCategoryList.data.getCategories.map((item, index) => {
                    return (
                      <option key={index} value={item.subCategoryId}>
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
              >
                {getSubCategoryList.data &&
                  getSubCategoryList.data.getSubCategoriesByCategoryId.map(
                    (item, index) => {
                      return (
                        <option key={index} value={item.value}>
                          {item.name}
                        </option>
                      );
                    }
                  )}
              </select>
            </div>
            <div className="mt-2">
              <label> Sub Sub Category </label>
              <select
                onChange={handleSubSubCategoryChange}
                className="mt-1 form-control"
              >
                {getSubSubCategoryList.data && getSubSubCategoryList.data ? (
                  getSubSubCategoryList.data.getSubSubCategoriesBySubCategoryId.map(
                    (item, index) => {
                      return (
                        <option key={index} value={item.subSubCategoryId}>
                          {item.name}
                        </option>
                      );
                    }
                  )
                ) : (
                  <option value={"No Data"}>No Data</option>
                )}
              </select>
            </div>
            <div className="mt-2">
              <label> Status </label>
              <div>{viewTaskValues && viewTaskValues.getTask.statusName}</div>
            </div>
            <div className="mt-2">
              <label> Last Status TimeStamp </label>

              <div>--</div>
            </div>
            <div className="mt-2">
              <label> Last Updated By </label>
              <div>{viewTaskValues && viewTaskValues.getTask.resolvedBy}</div>
            </div>
            <div className="mt-2">
              <label>Created On </label>
              <div>
                {viewTaskValues &&
                  viewTaskValues.getTask.createdDate.formatString}
              </div>
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
              <div>
                {viewTaskValues && viewTaskValues.getTask.createdByName}
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
          <div className="col-xs-12 col-sm-5 col-md-5  ">
            <div className="mt-2">
              <label> Subject </label>
              <input
                type="text"
                value={viewTaskValues && viewTaskValues.getTask.title}
                className="form-control mt-1"
              />
            </div>
            <div className="mt-2">
              <label> Description</label>
              <input
                type="text"
                className="form-control mt-1 "
                value={viewTaskValues && viewTaskValues.getTask.description}
              />
              {/* {viewTaskValues && viewTaskValues.getTask.description} */}
              {/* </textarea> */}
            </div>
            <div className="mt-2">
              <label> Link to Previous </label>
            </div>
            <div className="mt-2">
              <label> Assigned To </label>
              <div>
                {viewTaskValues && viewTaskValues.getTask.currentAssigneeName}
              </div>
            </div>
            <div className="mt-2">
              <label className="mt-1 w-100">
                {" "}
                ETA
                <div className="d-flex form-control cursor-pointer mt-1">
                  <ReactDatePicker
                    type="text"
                    name="fromDate"
                    className="datePickerField col-lg-12 border-0 "
                    dateFormat="dd-MM-yyyy"
                    selected={startDate}
                    placeholderText="start date"
                    onChange={(date) => setStartDate(date)}
                  />
                  <BsCalendar className="mt-1" />
                </div>
              </label>
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
