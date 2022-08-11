import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { ImDownload3 } from "react-icons/im";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Footer from "./Footer";
import NavBar from "./Nav-bar";

const VIEW_TASK_QUERY = gql`
  query VIEWTASK($taskId: ID!) {
    getTask(taskId: $taskId) {
      taskId
      taskGroupId
      categoryId
      createdDate {
        formatString(format: "dd-MMM-yyyy")
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
        formatString(format: "dd-MMM-yyyy")
      }
      dueDate {
        formatString(format: "dd-MMM-yyyy")
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

const GETCATEGORY_QUERY = gql`
  query GETCATEGORY($categoryId: ID!) {
    getCategory(categoryId: $categoryId) {
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
const SUB_CATEGORY_QUERY = gql`
  {
    getSubCategoriesByCategoryId(categoryId: 2) {
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

const GET_USERS_QUERY = gql`
  query USERSLIST {
    getUsers {
      userId
      emailAddress
      inactive
    }
  }
`;
const GET_FILES_QUERY = gql`
  query getFILES($taskId: ID!) {
    getWork(taskId: $taskId) {
      task {
        taskId
      }
      taskLogs {
        taskFiles {
          fileName
          fileId
        }
      }
    }
  }
`;

function Managetask({ logoutClick, userDetails }) {
  let { id } = useParams();
  const [userDetail, setUserDetail] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [startDate, setStartDate] = useState("");
  const userResponse = useQuery(GET_USERS_QUERY);
  const [getSubCategory, subCategoryResponse] =
    useLazyQuery(SUB_CATEGORY_QUERY);
  console.log(id);
  let taskId = parseInt(id);

  const response = useQuery(VIEW_TASK_QUERY, {
    variables: { taskId: taskId },
  });
  const fileListResponse = useQuery(GET_FILES_QUERY, {
    variables: { taskId: taskId },
  });

  console.log("fileListResponse  ::", fileListResponse);

  useEffect(() => {
    if (response.loading) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [response]);

  // response && response.loading ? setShowLoader(true) : setShowLoader(false);

  const viewTaskValues = response.data;
  let catId = viewTaskValues.getTask.categoryId;

  // to get selectedCategory Details

  const selectedCategory = useQuery(GETCATEGORY_QUERY, {
    variables: catId,
  });
  console.log("cat", selectedCategory);

  // setStartDate(due_Date);
  const formattedDate = (due_Date) => {};
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
  const [defCat, setDefCat] = useState([]);

  const handleCategoryChange = (e) => {
    console.log(e.target.value);
    setDefCat(e.target.value);
    let key = e.target.value;
  };
  const handleSubCategoryChange = (e) => {
    console.log(e.target.value);
    let key = e.target.value;
    // setDefSubCat(e.target.value);
  };
  const handleSubSubCategoryChange = (e) => {
    // setDefSubSubCat(e.target.value);
  };
  let due_Date = new Date();
  useEffect(() => {
    due_Date = viewTaskValues && viewTaskValues.getTask.dueDate.formatString;
    console.log("dueDate before :", due_Date);
    due_Date = new Date(due_Date && due_Date);
    console.log("due Date :: ", due_Date);
    setStartDate(due_Date);
  }, [viewTaskValues]);
  const docs = [
    {
      uri: "https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ",
    }, // Local File
  ];

  const [statusList, setStatusList] = useState([
    {
      id: 1,
      name: "ASSIGNED",
    },
    {
      id: 2,
      name: "In Progress",
    },
    {
      id: 3,
      name: "New",
    },
    {
      id: 4,
      name: "Re Assigned",
    },
    {
      id: 5,
      name: "Closed",
    },
    {
      id: 6,
      name: "Reopened",
    },
  ]);
  const downloadFile = (fileName) => {
    console.log(taskId);
    console.log(fileName);
  };
  const [createTaskInput, setCreateTaskInput] = useState({
    categoryId: 0,
    subCategoryId: 0,
    subSubCategoryId: 0,
    currentAssignee: 0,
    title: "",
    description: "",
    dueDate: "",
    creationLocLatitude: "",
    creationLocLongitude: "",
    refTaskId: "",
    notes: "",
    fileIds: [],
  });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("taskId : ", taskId);
    console.log(categoryId);
    setCreateTaskInput((prevState) => ({
      ...prevState,
      title: viewTaskValues && viewTaskValues.getTask.title,
    }));
    setCreateTaskInput((prevState) => ({
      ...prevState,
      description: viewTaskValues && viewTaskValues.getTask.description,
    }));
    console.log("createTask Input : ", createTaskInput);
  };

  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      <br />
      <div className="main-container mb-4 container">
        {showLoader && (
          <>
            <div class="d-flex justify-content-center align-items-center loader">
              <div class="spinner-border" role="status"></div>
            </div>
          </>
        )}
        {showLoader == false && (
          <>
            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-xs-12 col-sm-5 col-md-5 ">
                  <div className="mt-2">
                    <label> Task ID </label>
                    <input
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel"
                      value={viewTaskValues && viewTaskValues.getTask.taskId}
                      disabled
                    />
                  </div>
                  <div className="mt-2">
                    <label> Title </label>
                    <input
                      type="text"
                      value={viewTaskValues && viewTaskValues.getTask.title}
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel"
                      disabled
                    />
                  </div>
                  <div className="mt-2">
                    <label> Description</label>
                    <input
                      type="text"
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel"
                      value={
                        viewTaskValues && viewTaskValues.getTask.description
                      }
                      disabled
                    />
                    {/* {viewTaskValues && viewTaskValues.getTask.description} */}
                    {/* </textarea> */}
                  </div>
                  <div className="mt-2">
                    <label> Category </label>
                    <Select
                      name="category"
                      placeholder="Category"
                      // className="mt-2 form-control"
                      className=" box shadow-none border-0 border-bottom  createTaskMandatoryLabel w-100"
                      options={
                        getCategoryList.data &&
                        getCategoryList.data.getCategories.map(
                          ({ categoryId: value, name: label }) => ({
                            label,
                            value,
                          })
                        )
                      }
                      defaultValue={{
                        label: "design specifications",
                        value: 2,
                      }}
                      onChange={(selectedOption) => {
                        getSubCategory({
                          variables: {
                            categoryId: setCreateTaskInput((prevState) => ({
                              ...prevState,
                              categoryId: selectedOption.value,
                            })),
                          },
                        });
                      }}
                    ></Select>
                    {/* <select className="mt-1 form-control">
                      {getCategoryList.data &&
                        getCategoryList.data.getCategories.map(
                          (item, index) => {
                            return (
                              <option key={index} value={item.subCategoryId}>
                                {item.name}
                              </option>
                            );
                          }
                        )}
                    </select> */}
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
                      {getSubSubCategoryList.data &&
                      getSubSubCategoryList.data ? (
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
                    <Select
                      name="handler"
                      placeholder="Handler"
                      // className="mt-2 form-control"
                      className=" box shadow-none border-0 border-bottom w-100 "
                      defaultValue={
                        viewTaskValues && viewTaskValues.getTask.currentAssignee
                      }
                      options={
                        userResponse.data &&
                        userResponse.data.getUsers.map(
                          ({ userId: value, emailAddress: label }) => ({
                            label,
                            value,
                          })
                        )
                      }
                    ></Select>
                  </div>
                  <div className="mt-2">
                    <Select
                      name="watcher"
                      className=" box shadow-none border-0 border-bottom w-100 createTaskMandatoryLabel"
                      required={true}
                      placeholder="watcher"
                      options={
                        userResponse.data &&
                        userResponse.data.getUsers.map(
                          ({ userId: value, emailAddress: label }) => ({
                            label,
                            value,
                          })
                        )
                      }
                      // onChange={(selectedOption) => {
                      //   setInputCriteria({
                      //     ...inputCriteria,
                      //     brand_name: selectedOption,
                      //   });
                      // }}
                      isMulti
                    />
                  </div>

                  <div className="mt-2">
                    <div>
                      {fileListResponse.data &&
                        fileListResponse.data.getWork.taskLogs.length > 0 && (
                          <div className="">
                            <label className="marginRight1 mt-1">
                              {" "}
                              Attached Files &nbsp;{" "}
                            </label>
                            <div className="uploaded-file">
                              <Table responsive className="border-0 mt-1">
                                <tbody>
                                  {fileListResponse.data.getWork.taskLogs[0].taskFiles.map(
                                    (file, index) => {
                                      console.log("file : ", taskId);
                                      return (
                                        <tr key={index}>
                                          <td className="border-0 fontSize11">
                                            {" "}
                                            {file.fileName}{" "}
                                          </td>
                                          <td className="border-0 fontSize11">
                                            {" "}
                                            <a
                                              title="download"
                                              href={
                                                `http://3.110.3.72/events/download/fileId/` +
                                                file.fileId +
                                                `/taskId/` +
                                                taskId +
                                                `/`
                                              }
                                              target="_blank"
                                            >
                                              <span
                                                className="cursor-pointer"
                                                onClick={() => {
                                                  downloadFile(file.fileName);
                                                }}
                                              >
                                                <ImDownload3 />
                                              </span>
                                            </a>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </Table>
                            </div>
                            <div className="upload-btn d-flex justify-content-end">
                              <button
                                type="button"
                                // onClick={fileUploadAll}
                                className="form-control btn-clr w-25 "
                              >
                                Upload
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="col-md-1"></div>
                <div className="col-xs-12 col-sm-5 col-md-5  ">
                  {/* <div className="mt-2">
                  <label> Link to Previous </label>
                </div> */}
                  <div className="mt-2">
                    <label> Status </label>
                    <div>
                      <select
                        onChange={handleSubSubCategoryChange}
                        className="mt-1 form-control"
                      >
                        {viewTaskValues && viewTaskValues.getTask.statusName ? (
                          statusList.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })
                        ) : (
                          <option value={"No Data"}>No Data</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label> Resolution </label>
                    <input
                      type="text"
                      value={
                        viewTaskValues && viewTaskValues.getTask.resolution
                      }
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel"
                    />
                  </div>

                  <div className="mt-2">
                    <label className="mt-1 w-100">
                      {" "}
                      Due Date
                      {console.log(
                        viewTaskValues &&
                          viewTaskValues.getTask.dueDate.formatString
                      )}
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
                    <label> Created By </label>
                    <input
                      type="text"
                      value={
                        viewTaskValues && viewTaskValues.getTask.createdByName
                      }
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel"
                      disabled
                    />
                  </div>
                  <div className="mt-2">
                    <label>Created On </label>
                    <input
                      type="text"
                      value={
                        viewTaskValues &&
                        viewTaskValues.getTask.createdDate.formatString
                      }
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel"
                      disabled
                    />
                  </div>
                  <div className="mt-2">
                    <label> Last Status TimeStamp </label>

                    <div>--</div>
                  </div>
                  <div className="mt-2">
                    <label> Last Updated By </label>
                    <div>--</div>
                  </div>
                  <div className="mt-2">
                    {/* <Link to="/taskhistory"> */}
                    {/* <p className="d-flex justify-content-end">
                    <label className="cursor-pointer">
                      <a className=" underline">
                        click here to view history ...
                      </a>{" "}
                    </label>
                  </p> */}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2 col-lg-2"></div>
                <div className="col-md-8 col-lg-8 ">
                  <label> Notes </label>
                  <textarea className="form-control mt-1 "> </textarea>
                </div>
                <div className="col-md-2 col-lg-2"></div>
              </div>
              <br />

              <div className="row">
                <div className="col"></div>
                <div className="col mt-2 mb-5 ">
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
          </>
        )}
        <br />
        <br />
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default Managetask;
