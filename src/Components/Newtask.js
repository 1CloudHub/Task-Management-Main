import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Viewer } from "@react-pdf-viewer/core";
import DocViewer from "react-doc-viewer";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { BsCalendar } from "react-icons/bs";
import { FaEye, FaTimes, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import { CreateTaskInput } from "../GraphQL.js/QueryVariable";
import { useNavigate } from "react-router-dom";
import {
  CATEGORY_LIST_QUERY,
  CREATE_TASK_MUTATE,
  GET_SUB_CATEGORY_BY_CATEGORY_ID_QUERY,
  GET_SUB_SUB_CATEGORY_BY_CATEGORY_ID_QUERY,
  GET_USERS_QUERY,
} from "../Services/Query";
import { ErrorAlert } from "./ErrorAlert";
import Footer from "./Footer";
import NavBar from "./Nav-bar";
import Config from "../Services/HeadersConfig";
import AuthService from "../Services/AuthService";

const fileUploadURL = process.env.REACT_APP_FILE_UPLOAD_URL;
var userId = localStorage.getItem("userId");
var authToken = localStorage.getItem("jwt-token");
function Newtask({ logoutClick, userDetails }) {
  // Variable Declaration start

  useEffect(() => {
    Config(userId, authToken);
  }, []);
  const formref = useRef();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [file, setFile] = useState();
  const [startDate, setStartDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  function dateFormatter(date) {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    let formatted_date =
      date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear();
    return formatted_date;
  }
  const [createTaskInput, setCreateTaskInput] = useState(CreateTaskInput);
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState([]);
  const [popUpImage, setPopUpImage] = useState();
  const [openPdfFile, setOpenPdfFile] = useState("");
  const [showViewDocPopup, setShowViewDocPopup] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState();
  const [chars_left_description, setCharsLeftDescription] = useState(200);
  const [chars_left_subject, setCharsLeftSubject] = useState(125);
  const [mapError, setMapError] = useState(false);
  const [mapErrorTxt, setMapErrorTxt] = useState(false);
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  });
  //Variable Declaration end

  useEffect(() => {
    getPosition();
  }, []);

  // GRAPHQL query request and response start
  const [getSubCategory, subCategoryResponse] = useLazyQuery(
    GET_SUB_CATEGORY_BY_CATEGORY_ID_QUERY
  );
  ErrorAlert(subCategoryResponse);

  console.log(subCategoryResponse);
  const [getSubSubCategory, subsubCategoryResponse] = useLazyQuery(
    GET_SUB_SUB_CATEGORY_BY_CATEGORY_ID_QUERY
  );

  ErrorAlert(subsubCategoryResponse);
  const categoryResponse = useQuery(CATEGORY_LIST_QUERY);
  ErrorAlert(categoryResponse);
  // console.log(categoryResponse);
  const userResponse = useQuery(GET_USERS_QUERY);
  ErrorAlert(userResponse);
  const [deleteSelectedFile, setDeleteSelectedFile] = useState([]);
  // GRAPHQL query request and response end

  // Function start
  // to get the lat and long
  const displayLocation = (e) => {
    console.log(e.coords.latitude);
    const latitude = e.coords.latitude;
    const longitude = e.coords.longitude;
    console.log(latitude, longitude);
    setPosition({ lat: latitude, lng: longitude });
    console.log(position);
    setCreateTaskInput((prevState) => ({
      ...prevState,
      creationLocLatitude: latitude,
      creationLocLongitude: longitude,
    }));
  };

  const getPosition = () => {
    navigator.geolocation.getCurrentPosition(
      displayLocation,
      showError,
      options
    );
  };
  const showError = (error) => {
    console.log("showError", error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.warn("You denied the request for your location.");
        setMapError(true);
        setMapErrorTxt("Permission Denied for Location");
        break;
      case error.POSITION_UNAVAILABLE:
        toast.warn("Your Location information is unavailable.");
        setMapError(true);
        setMapErrorTxt("Location is Unavailable");
        break;
      case error.TIMEOUT:
        toast.warn("Your request timed out. Please try again");
        setMapErrorTxt("Request Time Out");
        setMapError(true);
        break;
      case error.UNKNOWN_ERROR:
        toast.warn(
          "An unknown error occurred please try again after some time."
        );
        setMapErrorTxt("Unknown Error occured !");
        setMapError(true);
        break;
    }
  };
  const options = {
    enableHighAccuracy: true,
  };
  const handleEyeIconClick = (file) => {
    setSelectedFileName(file.name);
    setPopUpImage(URL.createObjectURL(file));
    setOpenPdfFile(URL.createObjectURL(file));
    setFileType(file.type);
    setShowViewDocPopup(true);
  };
  const handleCloseClick = () => setShowViewDocPopup(false);

  const handleChangeSubjectData = ({ target: { name, value } }) => {
    setCreateTaskInput((prevState) => ({ ...prevState, title: value }));

    const max_chars = 125;
    setCharsLeftSubject(max_chars - value.length);
  };
  const handleChangeDescriptionData = ({ target: { name, value } }) => {
    setCreateTaskInput((prevState) => ({ ...prevState, description: value }));
    const max_chars = 125;
    setCharsLeftDescription(max_chars - value.length);
  };

  const [fileType, setFileType] = useState();
  const handleChangeFileData = (event) => {
    // console.log(event);
    setUploadedFile([...event.target.files]);
    setFile(event.target.files);
    let array = [];
    array.push([event.target.files]);

    console.log(array);
  };

  var fileIdArray = [];

  const [SubmitTask, submitResponse] = useMutation(CREATE_TASK_MUTATE);
  const fileUploadAll = () => {
    uploadedFile.forEach((element, index, array) => {
      console.log(element);
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

  const onSubmit = (data) => {
    data.preventDefault();
    console.log("submit clicked", data);
    console.log(createTaskInput);

    console.log(Config(userId, authToken));
    // return false;

    if (
      createTaskInput.title &&
      createTaskInput.categoryId &&
      createTaskInput.description &&
      createTaskInput.currentAssignee &&
      createTaskInput.dueDate
    ) {
      if (uploadedFile.length === createTaskInput.fileIds.length) {
        console.log("inisde if ....");
        var userId = localStorage.getItem("userId");
        var authToken = localStorage.getItem("jwt-token");
        fetch(process.env.REACT_APP_GRAPHQL_SERVICE_URL, {
          method: "POST",
          headers: Config(
            localStorage.getItem("userId"),
            localStorage.getItem("jwt-token")
          ),
          body: JSON.stringify({
            query: `mutation ($input: CreateTaskInput!) {
                    createTask(input: $input) {
                      taskId
                      taskGroupId
                      title
                      description
                      referenceTaskId
                      createdBy
                      categoryId
                      subCategoryId
                      subSubCategoryId
                      dueDate {
                        formatString(format: "dd/MM/yyyy")
                      }
                    }
                  }`,
            variables: {
              input: {
                title: createTaskInput.title,
                categoryId: parseInt(createTaskInput.categoryId),
                subCategoryId: parseInt(createTaskInput.subCategoryId),
                description: createTaskInput.description,
                fileIds: createTaskInput.fileIds,
                currentAssignee: parseInt(createTaskInput.currentAssignee),
                lat: createTaskInput.creationLocLatitude,
                lon: createTaskInput.creationLocLongitude,
                dueDate: createTaskInput.dueDate,
                watcherIds: createTaskInput.watcherIds,
              },
            },
          }),
        })
          .then((response) => {
            response.json();
          })
          .then((response) => {
            console.log(response);
            toast.success("Submitted Successfully");
            navigate("/MyTask");
          });
        // const res = SubmitTask({
        //   variables: {
        //     input: {
        //       title: createTaskInput.title,
        //       categoryId: parseInt(createTaskInput.categoryId),
        //       subCategoryId: parseInt(createTaskInput.subCategoryId),
        //       description: createTaskInput.description,
        //       fileIds: createTaskInput.fileIds,
        //       currentAssignee: parseInt(createTaskInput.currentAssignee),
        //       lat: createTaskInput.creationLocLatitude.toString(),
        //       lon: createTaskInput.creationLocLongitude.toString(),
        //       dueDate: createTaskInput.dueDate,
        //       watcherIds: createTaskInput.watcherIds,
        //     },
        //   },
        // });
        console.log(submitResponse.error);

        if (submitResponse.data) {
          toast.success("submitted successfully");
          navigate("/MyTask");
        } else if (submitResponse.error) {
          toast.error("Error !");
        }
      } else {
        toast.error("please upload selected files");
      }
    } else {
      toast.error("Fill all required fields");
      return;
    }
  };

  const deleteSelectedRow = (index) => {
    console.log(index);
    let rows = uploadedFile;
    let array = rows;
    setDeleteSelectedFile(array.splice(index, 1));
    setUploadedFile(array);
  };
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const onChangeDate = (date) => {
    console.log(date);
    let formattedDate = formatDate(date);
    console.log(formattedDate);

    setStartDate(date);
    setCreateTaskInput((prevState) => ({
      ...prevState,
      dueDate: formattedDate,
    }));
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
    <div className="main ">
      <NavBar
        logoutClick={logoutClick}
        userDetails={userDetails}
        handleChangeFileData={handleChangeFileData}
      />

      <br />
      <div className="container main-container mb-5">
        <div>
          <form ref={formref} onSubmit={onSubmit}>
            <div className="row mt-2">
              <div className="col-xs-12 col-sm-12 col-md-6  ">
                <div className="">
                  <input
                    type="text"
                    // className="form-control"
                    placeholder="Title"
                    className="box shadow-none border-0 border-bottom w-100 createTaskMandatoryLabel"
                    name="title"
                    // {...register("subjectLine", { required: true })}
                    onChange={handleChangeSubjectData}
                  />

                  {errors.subjectLine && (
                    <p className="text-danger span-error"> Title is required</p>
                  )}
                </div>
                <div className="mt-3">
                  <textarea
                    placeholder="Description"
                    name="description"
                    // {...register("description", { required: true })}
                    onChange={handleChangeDescriptionData}
                    className="box shadow-none border-0 border-bottom w-100 createTaskMandatoryLabel"
                  />
                  {errors.description && (
                    <p className="text-danger span-error">
                      {" "}
                      Description is required
                    </p>
                  )}
                  <p className="charLeftClass">
                    {/* Document cannot exceed 200 characters */}
                    characters left : {chars_left_description}
                  </p>
                </div>
                <div className=" mt-3">
                  <Select
                    name="category"
                    placeholder="Category"
                    // className="mt-2 form-control"
                    className=" box shadow-none border-0 border-bottom  createTaskMandatoryLabel w-100"
                    options={
                      categoryResponse.data &&
                      categoryResponse.data.getCategories.map(
                        ({ categoryId: value, name: label }) => ({
                          label,
                          value,
                        })
                      )
                    }
                    // {...register("category", { required: true })}
                    onChange={(selectedOption) => {
                      console.log(selectedOption.value);
                      getSubCategory({
                        variables: {
                          categoryId: selectedOption.value,
                        },
                      });
                      setCreateTaskInput((prevState) => ({
                        ...prevState,
                        categoryId: selectedOption.value,
                      }));
                    }}
                  ></Select>
                  {errors.category && (
                    <p className="text-danger span-error">
                      {" "}
                      Category is required
                    </p>
                  )}
                </div>

                <div className="mt-3">
                  <select
                    name="subcategory"
                    className="mt-2 border-0 border-bottom w-100 fontSize11"
                    // {...register("subcategory", { required: true })}
                    onChange={(e) => {
                      getSubSubCategory({
                        variables: {
                          subCategoryId: e.target.value,
                        },
                      });
                      setCreateTaskInput((prevState) => ({
                        ...prevState,
                        subCategoryId: e.target.value,
                      }));
                    }}
                    // className="mt-2 form-control"
                  >
                    <option value="">Sub Category </option>
                    {subCategoryResponse.data &&
                      subCategoryResponse.data.getSubCategoriesByCategoryId.map(
                        (item, index) => {
                          return (
                            <option key={index} value={item.subCategoryId}>
                              {item.name}
                            </option>
                          );
                        }
                      )}
                  </select>
                  {/* {errors.subcategory && (
                    <p className="text-danger span-error">
                      {" "}
                      Sub Category is required
                    </p>
                  )} */}
                </div>
                <div className="mt-3">
                  <select
                    name="subsubcategory"
                    placeholder="sub sub category"
                    // className="mt-2 form-control"
                    className="mt-2 border-0 border-bottom w-100 fontSize11"
                    onChange={(e) => {
                      setCreateTaskInput((prevState) => ({
                        ...prevState,
                        subSubCategoryId: parseInt(e.target.value),
                      }));
                    }}
                  >
                    <option value="">Sub Sub Category </option>
                    {subsubCategoryResponse.data &&
                    subsubCategoryResponse.data ? (
                      subsubCategoryResponse.data.getSubSubCategoriesBySubCategoryId.map(
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
                  <div>
                    {uploadedFile && uploadedFile.length > 0 && (
                      <div className="">
                        <label className="marginRight1 mt-2">
                          {" "}
                          Attached Files: &nbsp;{" "}
                        </label>
                        <div className="uploaded-file">
                          <Table responsive className="border-0 mt-2">
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
                                        onClick={() => handleEyeIconClick(file)}
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
              <div className="col-xs-12 col-sm-12 col-md-6 ">
                <div className="">
                  <Select
                    name="handler"
                    placeholder="Handler"
                    // className="mt-2 form-control"
                    className=" box shadow-none border-0 border-bottom w-100 createTaskMandatoryLabel"
                    {...register("handler", { required: true })}
                    onChange={(selectedOption) => {
                      setCreateTaskInput((prevState) => ({
                        ...prevState,
                        currentAssignee: selectedOption.value,
                      }));
                    }}
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
                  {errors.handler && (
                    <p className="text-danger span-error">
                      {" "}
                      Handler is required
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <Select
                    name="watcher"
                    className=" box shadow-none border-0 border-bottom w-100 fontSize11 watcher"
                    required={true}
                    placeholder="Watcher"
                    options={
                      userResponse.data &&
                      userResponse.data.getUsers.map(
                        ({ userId: value, emailAddress: label }) => ({
                          label,
                          value,
                        })
                      )
                    }
                    onChange={handleWatcherChange}
                    isMulti
                  />
                </div>

                <div className="mt-3">
                  <div className="d-flex cursor-pointer mt-1">
                    <ReactDatePicker
                      type="text"
                      name="fromDate"
                      placeholderText="Due Date"
                      className="datePickerField col-lg-12 border-0  w-100 border-bottom fontSize11"
                      dateFormat="dd-MM-yyyy"
                      selected={startDate}
                      autoComplete="off"
                      // onChange={(date) => setStartDate(date)}
                      // {...register("dueDate", { required: true })}
                      onChange={onChangeDate}
                    />
                    <BsCalendar className="mt-1 border-bottom" />
                  </div>
                  {errors.dueDate && (
                    <p className="text-danger span-error">
                      {" "}
                      Due Date is required
                    </p>
                  )}
                </div>
                <div className="mt-3 d-flex justify-content-center">
                  {/* <MapComponent
                    position={position}
                    mapError={mapError}
                    mapErrorTxt={mapErrorTxt}
                  /> */}
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col"></div>

              <div className="col">
                <button type="submit" className="form-control btn-clr">
                  {" "}
                  Submit{" "}
                </button>
              </div>
              <div className="mt-2 mb-5 col"></div>
            </div>
          </form>
        </div>
        <Modal show={showViewDocPopup}>
          <Modal.Header>
            <div>{selectedFileName}</div>
            <FaTimes onClick={handleCloseClick} />{" "}
          </Modal.Header>
          <Modal.Body>
            {fileType == "application/pdf" ? (
              <Viewer fileUrl={openPdfFile} />
            ) : fileType == "image/png" ? (
              <img src={popUpImage} />
            ) : (
              ""
            )}
            {/* <img src={popUpImage} />
            <Viewer fileUrl={openPdfFile} /> */}
            <DocViewer documents={openPdfFile} />
          </Modal.Body>
        </Modal>
        <Footer />
      </div>
      <br />
      <br />
    </div>
  );
}

export default Newtask;
