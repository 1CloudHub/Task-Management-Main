import { gql, useQuery } from "@apollo/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { FaEye, FaTimes, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { CreateTaskInput } from "../GraphQL.js/QueryVariable";
import Config, { Client } from "../Services/HeadersConfig";
import {
  ACCEPT_TASK_QUERY,
  CATEGORY_LIST_QUERY,
  CLOSE_TASK_QUERY,
  CREATE_TASK_MUTATE,
  EDIT_TASK_SUBMIT_QUERY,
  GETCATEGORY_QUERY,
  GET_FILES_QUERY,
  GET_SUB_CATEGORY_BY_CATEGORY_ID_QUERY,
  GET_SUB_SUB_CATEGORY_BY_CATEGORY_ID_QUERY,
  GET_USERS_QUERY,
  REOPEN_TASK_QUERY,
  RESOLVE_TASK_QUERY,
  RE_ASSIGNTASK_QUERY,
  VIEW_TASK_QUERY,
} from "../Services/Query";
import { Status } from "../Services/Status";
import Footer from "./Footer";
import NavBar from "./Nav-bar";

function Managetask({ logoutClick, userDetails }) {
  const [fileIdsArrays, setFileIdssArray] = useState([]);
  const fileDownloadUrl = process.env.REACT_APP_FILE_DOWNLOAD_URL;
  const fileUploadURL = process.env.REACT_APP_FILE_UPLOAD_URL;
  var userId = localStorage.getItem("userId");
  var authToken = localStorage.getItem("jwt-token");
  let { id } = useParams();
  const client = Client;
  const [showLoader, setShowLoader] = useState(false);
  const [startDate, setStartDate] = useState("");
  const userResponse = useQuery(GET_USERS_QUERY);
  const [resolution, setResolution] = useState("");
  const [isShowResoltionError, setIsShowResoltionError] = useState(false);
  const [createTaskInput, setCreateTaskInput] = useState(CreateTaskInput);

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

    let selectedWatcherIdArray = [];
    selectedWatchers &&
      selectedWatchers.getWork.watchers.forEach((item, index) => {
        console.log(item);
        let obj = {};
        obj["label"] = item.watcherName;
        obj["value"] = item.watcherId;
        watcherDataArray.push(obj);
        selectedWatcherIdArray.push(item.watcherId);
        // setFileIdssArray(...item.watcherId);
      });
    setCreateTaskInput((prevState) => ({
      ...prevState,
      watcherIds: selectedWatcherIdArray,
    }));
    selectedWatchers &&
      selectedWatchers.getWork.taskLogs[0].taskFiles.forEach(
        (element, index) => {
          console.log("file ides", element);
          fileIdsArrays.push(element.uuid);
        }
      );
    setCreateTaskInput((prevState) => ({
      ...prevState,
      fileIds: fileIdsArrays,
    }));

    // console.log("fileID ARRAY initial state >>", fileIdArray);
  };

  // console.log("wactherName : ", watcherDataArray);

  const viewTaskValues = response.data;
  const navigate = useNavigate();
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

  // console.log("getSubCategoryList --", getSubCategoryList);
  const [subCategoryResponse, setSubCategoryResponse] = useState([]);
  const [subSubCategoryResponse, setSubSubCategoryResponse] = useState([]);

  let subCategoryId =
    viewTaskValues && parseInt(viewTaskValues.getTask.subCategoryId);
  console.log(subCategoryId);

  let subSubCategoryId =
    viewTaskValues && parseInt(viewTaskValues.getTask.subSubCategoryId);
  let currentAssignee =
    viewTaskValues && parseInt(viewTaskValues.getTask.currentAssignee);
  let title = viewTaskValues && viewTaskValues.getTask.title;
  let description = viewTaskValues && viewTaskValues.getTask.description;
  let lat = viewTaskValues && viewTaskValues.getTask.creationLocLatitude;
  let lon = viewTaskValues && viewTaskValues.getTask.creationLocLongitude;
  let status = viewTaskValues && viewTaskValues.getTask.status;
  let statusName = viewTaskValues && viewTaskValues.getTask.statusName;
  // statusName = "IN_PROGRESS";

  // const getSubSubCategoryList = useQuery(SUB_CATEGORY_BY_CATEGORYID_QUERY, {
  //   variables: {
  //     subCategoryId: 2,
  //   },
  // });

  console.log("sub_ category", subCategoryId);

  const getSub_SubSubCategory = (categoryId, subCategoryId) => {
    client
      .query({
        query: GET_SUB_CATEGORY_BY_CATEGORY_ID_QUERY,
        variables: {
          categoryId: categoryId,
        },
      })
      .then((response) => {
        console.log("sub category response ", response);
        setSubCategoryResponse(response);
        console.log("inside if >> ", subCategoryId);
        if (!isNaN(subCategoryId)) {
          getSubSubCategoryById(subCategoryId);
        }
      })
      .catch((err) => console.error(err));
  };
  const getSubSubCategoryById = (subCategoryId) => {
    console.log(subCategoryId);
    client
      .query({
        query: GET_SUB_SUB_CATEGORY_BY_CATEGORY_ID_QUERY,
        variables: {
          subCategoryId: subCategoryId,
        },
      })
      .then((response) => {
        console.log("sub category response ", response);
        setSubSubCategoryResponse(response);
        if (response.data.getSubSubCategoriesBySubCategoryId.length != 0) {
          setCreateTaskInput((prevState) => ({
            ...prevState,
            subSubCategoryId:
              response.data.getSubSubCategoriesBySubCategoryId[0].subCategoryId,
          }));
        }
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
    if (!isNaN(subCategoryId)) {
      getSub_SubSubCategory(catId, subCategoryId);
    }
    setCreateTaskInput((prevState) => ({ ...prevState, categoryId: catId }));

    console.log("inside useEff >>", createTaskInput.subCategoryId);
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
    setCreateTaskInput((prevState) => ({
      ...prevState,
      lat: lat,
    }));
    setCreateTaskInput((prevState) => ({
      ...prevState,
      lon: lon,
    }));
    if (statusName == "RESOLVED") {
      setIsShowResolution(true);
    } else {
      setIsShowResolution(false);
    }
  }, [
    response,
    selectedCategory,
    getCategoryList,
    getWorkResponse,
    statusName,
  ]);

  const handleSubCategoryChange = (e) => {
    console.log(e.target.value);
    setCreateTaskInput((prevState) => ({
      ...prevState,
      subCategoryId: e.target.value,
    }));

    getSubSubCategoryById(e.target.value);
  };
  const handleSubSubCategoryChange = (e) => {
    // setDefSubSubCat(e.target.value);
    setCreateTaskInput((prevState) => ({
      ...prevState,
      subSubCategoryId: e.target.value,
    }));
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
    return;
    let inputVariables = {};
    if (createTaskInput.subCategoryId == 0) {
      inputVariables = {
        title: createTaskInput.title,
        categoryId: parseInt(createTaskInput.categoryId),
        description: createTaskInput.description,
        fileIds: createTaskInput.fileIds,
        currentAssignee: parseInt(createTaskInput.currentAssignee),
        lat: createTaskInput.lat,
        lon: createTaskInput.lon,
        dueDate: createTaskInput.dueDate,
        watcherIds: createTaskInput.watcherIds,
      };
    } else if (createTaskInput.subCategoryId != 0) {
      inputVariables = {
        title: createTaskInput.title,
        categoryId: parseInt(createTaskInput.categoryId),
        subCategoryId: parseInt(createTaskInput.subCategoryId),
        description: createTaskInput.description,
        fileIds: createTaskInput.fileIds,
        currentAssignee: parseInt(createTaskInput.currentAssignee),
        lat: createTaskInput.lat,
        lon: createTaskInput.lon,
        dueDate: createTaskInput.dueDate,
        watcherIds: createTaskInput.watcherIds,
      };
    } else if (createTaskInput.subSubCategoryId == 0) {
      inputVariables = {
        title: createTaskInput.title,
        categoryId: parseInt(createTaskInput.categoryId),
        subCategoryId: parseInt(createTaskInput.subCategoryId),
        description: createTaskInput.description,
        fileIds: createTaskInput.fileIds,
        currentAssignee: parseInt(createTaskInput.currentAssignee),
        lat: createTaskInput.lat,
        lon: createTaskInput.lon,
        dueDate: createTaskInput.dueDate,
        watcherIds: createTaskInput.watcherIds,
      };
    } else if (createTaskInput.subSubCategoryId != 0) {
      inputVariables = {
        title: createTaskInput.title,
        categoryId: parseInt(createTaskInput.categoryId),
        subCategoryId: parseInt(createTaskInput.subCategoryId),
        subSubCategoryId: parseInt(createTaskInput.subSubCategoryId),
        description: createTaskInput.description,
        fileIds: createTaskInput.fileIds,
        currentAssignee: parseInt(createTaskInput.currentAssignee),
        lat: createTaskInput.lat,
        lon: createTaskInput.lon,
        dueDate: createTaskInput.dueDate,
        watcherIds: createTaskInput.watcherIds,
      };
    }
    var userId = localStorage.getItem("userId");
    var authToken = localStorage.getItem("jwt-token");
    fetch(process.env.REACT_APP_GRAPHQL_SERVICE_URL, {
      method: "POST",
      headers: Config(
        localStorage.getItem("userId"),
        localStorage.getItem("jwt-token")
      ),
      body: JSON.stringify({
        query: EDIT_TASK_SUBMIT_QUERY,
        variables: {
          input: {
            amend: createTaskInput,
            taskId: taskId,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);

        if (response.data != null) {
          toast.success("Editted Successfully");
          navigate("/MyTask");
        } else {
          let myObj = response.errors[0].extensions;
          if ("status" in myObj) {
            toast.warn(response.errors[0].extensions.status);
          } else if ("assigneeUserId" in myObj) {
            toast.warn(response.errors[0].extensions.assigneeUserId);
          } else if ("NewState" in myObj)
            toast.warn(response.errors[0].extensions.NewState);
          else if ("userId" in myObj) {
            toast.error(response.errors[0].extensions.userId);
          }
        }
      });
  };

  const handleCategory = (e) => {
    console.log(e.target.value);
    setCreateTaskInput((prevState) => ({
      ...prevState,
      categoryId: e.target.value,
    }));
    getSub_SubSubCategory(e.target.value, subCategoryId);
  };

  const statusClientCall = (query, inputVar, statusSelectedVal) => {
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
        fetchPolicy: "network-only",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("status response ", response);
        if (response.data != null) {
          setSelectedStatus(statusSelectedVal);
          if (statusSelectedVal === "RESOLVED") {
            setIsShowResolution(true);
          } else {
            setIsShowResolution(false);
          }
          toast.success("status changed successfully");
        } else {
          console.log(response.errors[0].extensions.assigneeUserId);
          setSelectedStatus(status);
          let myObj = response.errors[0].extensions;
          if ("assigneeUserId" in myObj) {
            toast.warn(response.errors[0].extensions.assigneeUserId);
          } else if ("NewState" in myObj)
            toast.warn(response.errors[0].extensions.NewState);
          else if ("userId" in myObj) {
            toast.error(response.errors[0].extensions.userId);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        toast.warn(err.errors[0].extensions.NewState);
      });
  };

  const [isShowResolution, setIsShowResolution] = useState(false);
  const handleStatusChange = (e) => {
    console.log("previous status value: ", status);
    let userID = localStorage.getItem("userId");
    console.log("userId >>", userID);
    let statusSelectedVal = e.target.value;
    console.log(e.target.value);
    let inputVar = {};

    if (statusSelectedVal === "REASSIGNED") {
      inputVar = {
        taskId: parseInt(taskId),
        assigneeUserId: parseInt(userId),
        fileIds: createTaskInput.fileIds,
        notes: createTaskInput.notes,
      };
      statusClientCall(RE_ASSIGNTASK_QUERY, inputVar, statusSelectedVal);
    } else if (statusSelectedVal === "RESOLVED") {
      if (resolution == "") {
        setIsShowResoltionError(true);
      } else {
        setIsShowResoltionError(false);
        inputVar = {
          taskOperationInput: {
            taskId: parseInt(taskId),
            assigneeUserId: parseInt(userId),
            fileIds: createTaskInput.fileIds,
            notes: createTaskInput.notes,
          },
          resolution: resolution,
        };
        statusClientCall(RESOLVE_TASK_QUERY, inputVar, statusSelectedVal);
      }
    } else if (statusSelectedVal === "CLOSED") {
      inputVar = {
        taskId: parseInt(taskId),
        assigneeUserId: parseInt(userId),
        fileIds: createTaskInput.fileIds,
        notes: createTaskInput.notes,
      };
      statusClientCall(CLOSE_TASK_QUERY, inputVar, statusSelectedVal);
    } else if (statusSelectedVal === "REOPENED") {
      inputVar = {
        taskId: parseInt(taskId),
        assigneeUserId: parseInt(userId),
        fileIds: createTaskInput.fileIds,
        notes: createTaskInput.notes,
      };
      statusClientCall(REOPEN_TASK_QUERY, inputVar, statusSelectedVal);
    } else if (statusSelectedVal === "IN_PROGRESS") {
      inputVar = {
        taskId: parseInt(taskId),
        assigneeUserId: parseInt(userId),
        fileIds: createTaskInput.fileIds,
        notes: createTaskInput.notes,
      };
      statusClientCall(ACCEPT_TASK_QUERY, inputVar, statusSelectedVal);
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
    let url = fileDownloadUrl + selectedfile.uuid + "/taskId/" + taskId + "/";
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

  const [downloadData, setDownloadData] = useState();
  const [disableIcons, setDisableIcons] = useState(false);
  const fileUpload = () => {
    alert("click");
    console.log("fileIdArrays : :", fileIdsArrays);
    uploadedFile.forEach((element, index, array) => {
      const formData = new FormData();
      formData.append("file", element);
      // console.log("filed upload veliya", fileIdArray);
      axios
        .post(fileUploadURL, formData, {
          headers: Config(userId, authToken),
        })
        .then((response) => {
          console.log("file API response : ", response);
          let resp = response.data.fileId;
          // fileIdArray.push(resp);
          fileIdsArrays.push(resp);
          setFileIdssArray([...response.data.fileId]);
        })
        .catch((error) => {
          console.log("file API error:", error);
          toast.error(error);
        });
    });
    setCreateTaskInput((prevState) => ({
      ...prevState,
      fileIds: fileIdsArrays,
    }));
    console.log("file uploaded :;", fileIdsArrays.length, fileIdsArrays);
    toast.success("File Uploaded successfully");
  };
  const handleWatcherChange = (e) => {
    console.log(e);
    let array = [];
    e.forEach((item) => {
      array.push(item.value);
    });
    setCreateTaskInput((prevState) => ({ ...prevState, watcherIds: array }));
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
                  <div className="show-web mt-3">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      className="fontSize11"
                      onChange={handleChangeFileData}
                      multiple
                    />
                  </div>
                  <div className="mt-3">
                    {existingFileData && (
                      <>
                        {existingFileData.getWork.taskLogs[0].taskFiles
                          .length != 0 && (
                          <label className="marginRight1 mt-2">
                            {" "}
                            Attached Files: &nbsp;{" "}
                          </label>
                        )}

                        <Table className="border-0">
                          <tbody>
                            {existingFileData &&
                              existingFileData.getWork.taskLogs[0].taskFiles.map(
                                (item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                        style={{ width: "80%" }}
                                        className="border-0 fontSize11"
                                      >
                                        {" "}
                                        {item.fileName}{" "}
                                      </td>

                                      <td className="border-0 fontSize11 cursor-pointer">
                                        {" "}
                                        {}
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
                                      <td className="border-0 fontSize11"> </td>
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
                              onClick={fileUpload}
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
                  <div className="mt-2">
                    <label className=" w-100">
                      {" "}
                      Category
                      <select
                        name="category"
                        value={createTaskInput.categoryId}
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
                        value={createTaskInput.subCategoryId}
                        onChange={handleSubCategoryChange}
                        className="form-control createTaskMandatoryLabel"
                      >
                        {subCategoryResponse.data &&
                        subCategoryResponse.data
                          .getSubCategoriesByCategoryId ? (
                          subCategoryResponse.data.getSubCategoriesByCategoryId.map(
                            (item, index) => {
                              return (
                                <option key={index} value={item.subCategoryId}>
                                  {item.name}
                                </option>
                              );
                            }
                          )
                        ) : (
                          <option value={"No Data"}>No Data</option>
                        )}
                      </select>
                    </label>
                  </div>
                  <div className="mt-2">
                    <label className="w-100">
                      {" "}
                      Sub Sub Category
                      <select
                        value={createTaskInput.subSubCategoryId}
                        onChange={handleSubSubCategoryChange}
                        className=" form-control createTaskMandatoryLabel"
                      >
                        {subSubCategoryResponse.data &&
                        subSubCategoryResponse.data
                          .getSubSubCategoriesBySubCategoryId ? (
                          subSubCategoryResponse.data.getSubSubCategoriesBySubCategoryId.map(
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
                        ) : (
                          <option value={"No Data"}>No Data</option>
                        )}
                      </select>
                    </label>
                  </div>
                  {/* <div className="mt-2">
                  <label> Link to Previous </label>
                </div> */}
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
                      onChange={handleWatcherChange}
                      isMulti
                    />
                  </div>
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
                        onChange={(e) => setResolution(e.target.value)}
                      />
                      {isShowResoltionError && (
                        <p className="text-danger span-error">
                          {" "}
                          Resolution is required
                        </p>
                      )}
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
                  <textarea
                    className="form-control mt-1 "
                    onChange={(e) => {
                      setCreateTaskInput((prevState) => ({
                        ...prevState,
                        notes: e.target.value,
                      }));
                    }}
                  >
                    {" "}
                  </textarea>
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
