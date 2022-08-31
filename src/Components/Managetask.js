import { gql, useQuery } from "@apollo/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { FaEye, FaTimes, FaTrashAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import Config, { Client } from "../Services/HeadersConfig";
import { Status } from "../Services/Status";
import Footer from "./Footer";
import NavBar from "./Nav-bar";
const fileDownloadUrl = process.env.REACT_APP_FILE_DOWNLOAD_URL;
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
      creationLocLatitude
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
  query GETSUBCATEGORY($categoryId: Int!) {
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
        from
        fromName
        to
        toName
        start_date {
          formatString(format: "dd-MMM-yyyy")
        }
        end_date {
          formatString(format: "dd-MMM-yyyy")
        }
        taskFiles {
          fileName
          uuid
        }
      }
      watchers {
        watcherId
        watcherName
      }
    }
  }
`;

const RE_ASSIGNTASK_QUERY = `
  mutation REASSIGNTASK($input: TaskOperationInput!) {
    reassignTask(input: $input) {
      status
      statusName
    }
  }
`;

const RESOLVE_TASK_QUERY = `
  mutation RESOLVETASK($input: TaskResolutionInput!) {
    resolveTask(input: $input) {
      status
      statusName
    }
  }
`;
const CLOSE_TASK_QUERY = `
  mutation CLOSETASK($input: TaskOperationInput!) {
    closeTask(input: $input) {
      status
      statusName
    }
  }
`;
const REOPEN_TASK_QUERY = `
  mutation REPOPENTASK($input: TaskOperationInput!) {
    reopenTask(input: $input) {
      status
      statusName
    }
  }
`;
const ACCEPT_TASK_QUERY = `
  mutation ACCEPTTASK($input: TaskOperationInput!) {
    assignTask(input: $input) {
      status
      statusName
    }
  }
`;
const fileUploadURL = process.env.REACT_APP_FILE_UPLOAD_URL;
var userId = localStorage.getItem("userId");
var authToken = localStorage.getItem("jwt-token");
function Managetask({ logoutClick, userDetails }) {
  let { id } = useParams();
  const client = Client;
  const [userDetail, setUserDetail] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [startDate, setStartDate] = useState("");
  const userResponse = useQuery(GET_USERS_QUERY);

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

  // console.log(id);
  let taskId = parseInt(id);

  const response = useQuery(VIEW_TASK_QUERY, {
    variables: { taskId: taskId },
  });
  const getWorkResponse = useQuery(GET_FILES_QUERY, {
    variables: { taskId: taskId },
  });
  console.log("getWork Response : ", getWorkResponse);
  let existingFileData = getWorkResponse.data && getWorkResponse.data;
  // console.log("getWorkResponse  ::", getWorkResponse);

  let selectedWatchers = getWorkResponse.data && getWorkResponse.data;
  console.log("selectedWatchers  ::", selectedWatchers);

  const [watcherDataArray, setWatcherDataArray] = useState([]);

  const fetchWatcherData = () => {
    setWatcherDataArray([]);
    selectedWatchers &&
      selectedWatchers.getWork.watchers.forEach((item, index) => {
        console.log(item);
        let obj = {};
        obj["label"] = item.watcherName;
        obj["value"] = item.watcherId;
        watcherDataArray.push(obj);
      });
  };

  // console.log("wactherName : ", watcherDataArray);
  let selectedCatObj = {};

  const viewTaskValues = response.data;
  // console.log(viewTaskValues);
  let catId = viewTaskValues && parseInt(viewTaskValues.getTask.categoryId);
  // catId = 3;

  // to get selectedCategory Details

  const selectedCategory = useQuery(GETCATEGORY_QUERY, {
    variables: {
      categoryId: catId,
    },
  });
  // to get category List -all
  const getCategoryList = useQuery(CATEGORY_LIST_QUERY);
  // to get categoryList

  // to get subcategory list
  const getSubCategoryList = useQuery(SUB_CATEGORY_BY_CATEGORYID_QUERY, {
    variables: {
      categoryId: catId,
    },
  });
  // console.log("getSubCategoryList --", getSubCategoryList);
  const [subCategoryResponse, setSubCategoryResponse] = useState([]);

  let subCategoryId =
    viewTaskValues && parseInt(viewTaskValues.getTask.subCategoryId);
  let currentAssignee =
    viewTaskValues && parseInt(viewTaskValues.getTask.currentAssignee);
  let title = viewTaskValues && viewTaskValues.getTask.title;
  let description = viewTaskValues && viewTaskValues.getTask.description;
  let latitude = viewTaskValues && viewTaskValues.getTask.creationLocLatitude;
  let status = viewTaskValues && viewTaskValues.getTask.status;
  let statusName = viewTaskValues && viewTaskValues.getTask.statusName;
  // statusName = "IN_PROGRESS";

  // const getSubSubCategoryList = useQuery(SUB_CATEGORY_BY_CATEGORYID_QUERY, {
  //   variables: {
  //     subCategoryId: 2,
  //   },
  // });
  const getSubCategory = (categoryId) => {
    client
      .query({
        query: SUB_CATEGORY_QUERY,
        variables: {
          categoryId: categoryId,
        },
      })
      .then((response) => {
        console.log("sub category response ", response);
        setSubCategoryResponse(response);
      })
      .catch((err) => console.error(err));
  };

  const getSubSubCategory = (subCategoryId) => {
    client
      .query({
        query: SUB_SUB_CATEGORY_BY_CATEGORYID_QUERY,
        variables: {
          categoryId: subCategoryId,
        },
      })
      .then((response) => {
        console.log("sub category response ", response);
        setSubCategoryResponse(response);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (response.loading) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
    fetchWatcherData();
    getSubCategory(catId);
    getSubSubCategory(subCategoryId);

    console.log(selectedCatObj);
    setCreateTaskInput((prevState) => ({ ...prevState, categoryId: catId }));
    setCreateTaskInput((prevState) => ({
      ...prevState,
      subCategoryId: subCategoryId,
    }));
    setCreateTaskInput((prevState) => ({
      ...prevState,
      currentAssignee: currentAssignee,
    }));
    setCreateTaskInput((prevState) => ({
      ...prevState,
      title: title,
    }));
    setCreateTaskInput((prevState) => ({
      ...prevState,
      description: description,
    }));
    if (statusName == "RESOLVED") {
      setIsShowResolution(true);
    } else {
      setIsShowResolution(false);
    }
  }, [response, selectedCategory, getCategoryList, getWorkResponse]);

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

  const [statusList, setStatusList] = useState(Status);
  const [selectedStatus, setSelectedStatus] = useState(statusName);
  const downloadFile = (fileName) => {
    console.log(taskId);
    console.log(fileName);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("taskId : ", taskId);
    console.log(catId);
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

  const handleCategory = (e) => {
    console.log(e.target.value);
    setCreateTaskInput((prevState) => ({
      ...prevState,
      categoryId: e.target.value,
    }));
    getSubCategory(e.target.value);
  };

  const statusClientCall = (query, inputVar) => {
    console.log("taskId >>", taskId);

    fetch(process.env.REACT_APP_GRAPHQL_SERVICE_URL, {
      method: "POST",
      headers: Config(
        localStorage.getItem("userId"),
        localStorage.getItem("jwt-token")
      ),
      body: JSON.stringify({
        query: query,
        variables: {
          input: inputVar,
        },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("status response ", response);
        if (response.data != null) {
        } else {
          console.log(response.errors[0].extensions.assigneeUserId);
          let myObj = response.errors[0].extensions;
          if ("assigneeUserId" in myObj) {
            toast.warn(response.errors[0].extensions.assigneeUserId);
          } else if ("NewState" in myObj)
            toast.warn(response.errors[0].extensions.NewState);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.warn(err.errors[0].extensions.NewState);
      });
  };

  const [isShowResolution, setIsShowResolution] = useState(false);
  const handleStatusChange = (e) => {
    let userID = localStorage.getItem("userId");
    console.log("userId >>", userID);
    setSelectedStatus(e.target.value);
    console.log(e.target.value);
    let inputVar = {};
    if (selectedStatus === "RESOLVED") {
      setIsShowResolution(true);
    } else {
      setIsShowResolution(false);
    }
    if (e.target.value === "REASSIGNED") {
      inputVar = {
        taskId: parseInt(taskId),
        assigneeUserId: parseInt(userId),
      };
      statusClientCall(RE_ASSIGNTASK_QUERY, inputVar);
    } else if (e.target.value === "RESOLVED") {
      inputVar = {
        taskOperationInput: {
          taskId: parseInt(taskId),
          assigneeUserId: parseInt(userId),
        },
        resolution: "check",
      };

      statusClientCall(RESOLVE_TASK_QUERY, inputVar);
    } else if (e.target.value === "CLOSED") {
      inputVar = {
        taskId: parseInt(taskId),
        assigneeUserId: parseInt(userId),
      };
      statusClientCall(CLOSE_TASK_QUERY, inputVar);
    } else if (e.target.value === "REOPENED") {
      inputVar = {
        taskId: parseInt(taskId),
        assigneeUserId: parseInt(userId),
      };
      statusClientCall(REOPEN_TASK_QUERY, inputVar);
    } else if (e.target.value === "IN_PROGRESS") {
      inputVar = {
        taskId: parseInt(taskId),
        assigneeUserId: parseInt(userId),
      };
      statusClientCall(ACCEPT_TASK_QUERY, inputVar);
    }
  };

  const [uploadedFile, setUploadedFile] = useState([]);

  const [fileType, setFileType] = useState();
  const [popUpImage, setPopUpImage] = useState();
  const [openPdfFile, setOpenPdfFile] = useState();
  const [showViewDocPopup, setShowViewDocPopup] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState();
  const [selectedFileToView, setSelectedFileToView] = useState();
  const [file, setFile] = useState([]);
  const [deleteSelectedFile, setDeleteSelectedFile] = useState([]);
  const handleEyeIconClick = (selectedfile) => {
    console.log(selectedfile);
    setShowViewDocPopup(true);
    let url = fileDownloadUrl + selectedfile.uuid + "/taskId/" + taskId;
    console.log(url);

    // setDownloadData(URL.createObjectURL(selectedfile));
    // setSelectedFileName(selectedfile.name);
    // let viewImage = URL.createObjectURL(selectedfile);
    // setPopUpImage(viewImage);
    // setOpenPdfFile(URL.createObjectURL(selectedfile));
    // setFileType(file.type);
    // setFileType(selectedfile.type);
    // console.log(openPdfFile);
  };
  const formData = new FormData();
  const handleCloseClick = () => setShowViewDocPopup(false);

  const deleteSelectedRow = (index) => {
    console.log(index);
    let rows = uploadedFile;
    let array = rows;
    setDeleteSelectedFile(array.splice(index, 1));
    setUploadedFile(array);
  };
  const handleChangeFileData = (event) => {
    // console.log(event);
    setUploadedFile([...event.target.files]);
    setFile(event.target.files);
    let array = [];
    array.push([event.target.files]);

    console.log(array);
  };

  const fileDownload = (selectedFile) => {
    var FileSaver = require("file-saver");
    var blob = new Blob([selectedFile], { type: "image/png" });
    FileSaver.saveAs(blob, selectedFile.name);
  };
  var fileIdArray = [];
  const [downloadData, setDownloadData] = useState();
  const [disableIcons, setDisableIcons] = useState(false);
  const fileUploadAll = () => {
    uploadedFile.forEach((element, index, array) => {
      const formData = new FormData();
      formData.append("file", element);
      axios
        .post(fileUploadURL, formData, {
          headers: Config(userId, authToken),
        })
        .then((response) => {
          console.log("file API response : ", response);
          let resp = response.data.fileId;
          fileIdArray.push(resp);
          setCreateTaskInput((prevState) => ({
            ...prevState,
            fileIds: fileIdArray,
          }));
        })
        .catch((error) => {
          console.log("file API error:", error);
          toast.error(error);
        });
    });
    toast.success("File Uploaded successfully");
  };
  return (
    <div>
      <NavBar
        logoutClick={logoutClick}
        userDetails={userDetails}
        handleChangeFileData={handleChangeFileData}
      />
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
                      className="border-0  w-100 createTaskMandatoryLabel isDisabled-field"
                      value={viewTaskValues && viewTaskValues.getTask.taskId}
                      disabled
                    />
                  </div>
                  <div className="mt-2">
                    <label> Title </label>
                    <input
                      type="text"
                      value={viewTaskValues && viewTaskValues.getTask.title}
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel isDisabled-field"
                      disabled
                    />
                  </div>
                  <div className="mt-2">
                    <label> Description</label>
                    <input
                      type="text"
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel isDisabled-field"
                      value={
                        viewTaskValues && viewTaskValues.getTask.description
                      }
                      disabled
                    />
                    {/* {viewTaskValues && viewTaskValues.getTask.description} */}
                    {/* </textarea> */}
                  </div>
                  <div className="mt-2">
                    <label className=" w-100">
                      {" "}
                      Category
                      <select
                        name="category"
                        value={createTaskInput.categoryId}
                        // value={
                        className=" form-control  createTaskMandatoryLabel"
                        onChange={handleCategory}
                      >
                        <option value={0}>All</option>
                        {getCategoryList.data &&
                          getCategoryList.data.getCategories.map(
                            (item, index) => {
                              return (
                                <option key={index} value={item.categoryId}>
                                  {item.name}
                                </option>
                              );
                            }
                          )}
                      </select>
                    </label>
                  </div>
                  <div className="mt-2">
                    <label className=" w-100">
                      {" "}
                      Sub Category
                      <select
                        value={0}
                        onChange={handleSubCategoryChange}
                        className="form-control createTaskMandatoryLabel"
                      >
                        {subCategoryResponse.data &&
                          subCategoryResponse.data.getSubCategoriesByCategoryId.map(
                            (item, index) => {
                              return (
                                <option key={index} value={item.value}>
                                  {item.name}
                                </option>
                              );
                            }
                          )}
                      </select>
                    </label>
                  </div>
                  <div className="mt-2">
                    <label className="w-100">
                      {" "}
                      Sub Sub Category
                      <select
                        onChange={handleSubSubCategoryChange}
                        className=" form-control createTaskMandatoryLabel"
                      >
                        {/* {getSubSubCategoryList.data &&
                        getSubSubCategoryList.data ? (
                          getSubSubCategoryList.data.getSubSubCategoriesBySubCategoryId.map(
                            (item, index) => {
                              return (
                                <option
                                  key={index}
                                  value={item.subSubCategoryId}
                                >
                                  {item.name}
                                </option>
                              );
                            }
                          )
                        ) : ( */}
                        <option value={"No Data"}>No Data</option>
                        {/* )} */}
                      </select>
                    </label>
                  </div>
                  <div className="mt-2">
                    <label className="w-100">
                      {" "}
                      Handler
                      <select
                        onChange={(e) => {
                          setCreateTaskInput((prevState) => ({
                            ...prevState,
                            currentAssignee: e.target.value,
                          }));
                        }}
                        value={createTaskInput.currentAssignee}
                        className=" form-control createTaskMandatoryLabel"
                      >
                        {userResponse.data &&
                          userResponse.data.getUsers.map((item, index) => {
                            return (
                              <option key={index} value={item.userId}>
                                {item.emailAddress}
                              </option>
                            );
                          })}
                      </select>
                    </label>
                  </div>
                  <div className="mt-2">
                    <Select
                      name="watcher"
                      className=" box shadow-none border-0 border-bottom w-100 watcher"
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
                      defaultValue={watcherDataArray}
                      // onChange={(selectedOption) => {
                      //   setInputCriteria({
                      //     ...inputCriteria,
                      //     brand_name: selectedOption,
                      //   });
                      // }}
                      isMulti
                    />
                  </div>
                  <div className="show-web mt-3">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      style={{ fontSize: "11px" }}
                      onChange={handleChangeFileData}
                      multiple
                    />
                  </div>
                  <div className="mt-3">
                    {existingFileData && (
                      <>
                        <label className="marginRight1 mt-2">
                          {" "}
                          Attached Files: &nbsp;{" "}
                        </label>
                        <Table className="border-0">
                          <tbody>
                            {existingFileData &&
                              existingFileData.getWork.taskLogs[0].taskFiles.map(
                                (item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="border-0 fontSize11">
                                        {" "}
                                        {item.fileName}{" "}
                                      </td>

                                      <td className="border-0 fontSize11 cursor-pointer">
                                        {" "}
                                        <a
                                          className=""
                                          onClick={() =>
                                            handleEyeIconClick(item)
                                          }
                                        >
                                          <FaEye />{" "}
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                          </tbody>
                        </Table>
                      </>
                    )}
                    <div>
                      {uploadedFile && uploadedFile.length > 0 && (
                        <div className="">
                          <div className="uploaded-file">
                            <label className="marginRight1 ">
                              {" "}
                              Current Attachment Files: &nbsp;{" "}
                            </label>
                            <Table responsive className="border-0 ">
                              <tbody>
                                {uploadedFile.map((file, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="border-0 fontSize11">
                                        {" "}
                                        {file.name}{" "}
                                      </td>
                                      <td className="border-0 fontSize11">
                                        {" "}
                                        <FaEye
                                          onClick={() =>
                                            handleEyeIconClick(file)
                                          }
                                        />{" "}
                                      </td>
                                      <td className="border-0 fontSize11">
                                        {" "}
                                        <FaTrashAlt
                                          onClick={(e) =>
                                            deleteSelectedRow(index, e)
                                          }
                                        />{" "}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </div>
                          <div className="upload-btn d-flex justify-content-end">
                            <button
                              type="button"
                              onClick={fileUploadAll}
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
                    <div>
                      <label className="w-100">
                        {" "}
                        Status
                        <select
                          onChange={handleStatusChange}
                          className="mt-1 form-control"
                          value={selectedStatus}
                        >
                          {viewTaskValues &&
                          viewTaskValues.getTask.statusName ? (
                            statusList.map((item, index) => {
                              return (
                                <option key={index} value={item.value}>
                                  {item.name}
                                </option>
                              );
                            })
                          ) : (
                            <option value={"No Data"}>No Data</option>
                          )}
                        </select>
                      </label>
                    </div>
                  </div>
                  {isShowResolution && (
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
                  )}

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
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel isDisabled-field"
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
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel isDisabled-field"
                      disabled
                    />
                  </div>
                  <div className="mt-2">
                    <label> Last Status TimeStamp </label>

                    <input
                      type="text"
                      value={
                        selectedWatchers &&
                        selectedWatchers.getWork.taskLogs[0].start_date
                          .formatString
                      }
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel isDisabled-field"
                      disabled
                    />
                  </div>
                  <div className="mt-2">
                    <label> Last Updated By </label>
                    <input
                      type="text"
                      value={
                        selectedWatchers &&
                        selectedWatchers.getWork.taskLogs[0].fromName
                      }
                      className="border-0 border-bottom w-100 createTaskMandatoryLabel isDisabled-field"
                      disabled
                    />
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
      <Modal show={showViewDocPopup}>
        <Modal.Header>
          <div>{selectedFileName}</div>
          <FaTimes onClick={handleCloseClick} />{" "}
        </Modal.Header>
        <Modal.Body>
          {/* {fileType == "application/pdf" ? (
            <Viewer fileUrl={openPdfFile} />
          ) : fileType == "image/png" ? (
            <img src={popUpImage} />
          ) : (
            ""
          )} */}
          {/* <img src={popUpImage} />
            <Viewer fileUrl={openPdfFile} /> */}
        </Modal.Body>
      </Modal>
      <Footer />
    </div>
  );
}

export default Managetask;
