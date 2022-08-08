import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { BsCalendar } from "react-icons/bs";
import { GrView } from "react-icons/gr";
import { toast } from "react-toastify";
import Footer from "./Footer";
import MapComponent from "./MapComponent";
import NavBar from "./Nav-bar";
import { Table, Modal } from "react-bootstrap";
import { FaEye, FaTimes, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import { Viewer } from "@react-pdf-viewer/core";

const CATEGORY_QUERY = gql`
  {
    getCategories {
      categoryId
      name
      createdBy
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

const SUB_SUB_CATEGORY_QUERY = gql`
  query GET_SUB_CATEGORY($categoryId: Int!) {
    getSubCategoriesByCategoryId(categoryId: $categoryId) {
      subCategoryId
      name
    }
  }
`;

const CREATE_TASK = gql`
  mutation ($input: CreateTaskInput!) {
    createTask(input: $input) {
      taskId
      taskGroupId
      title
      description
      referenceTaskId
      createdBy
      categoryId
      subCategoryId
      creationLocLatitude
      creationLocLongitude
      subSubCategoryId
      dueDate {
        formatString(format: "dd/MM/yyyy")
      }
      fileIds
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

function Newtask({ logoutClick, userDetails }) {
  // Variable Declaration start
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

  const [uploadedFile, setUploadedFile] = useState([]);
  const [popUpImage, setPopUpImage] = useState();
  const [openPdfFile, setOpenPdfFile] = useState("");
  const [showViewDocPopup, setShowViewDocPopup] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState();
  const [chars_left_description, setCharsLeftDescription] = useState(200);
  const [chars_left_subject, setCharsLeftSubject] = useState(125);
  const [data, setData] = useState();
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
  const [getSubCategory, subCategoryResponse] =
    useLazyQuery(SUB_CATEGORY_QUERY);
  const [getSubSubCategory, subsubCategoryResponse] = useLazyQuery(
    SUB_SUB_CATEGORY_QUERY
  );
  const categoryResponse = useQuery(CATEGORY_QUERY);
  console.log(categoryResponse);
  const userResponse = useQuery(GET_USERS_QUERY);
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

  const handleChangeData = ({ target: { name, value } }) => {
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

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
    setCreateTaskInput((prevState) => ({
      ...prevState,
      fileIds: array,
    }));
    console.log(createTaskInput.fileIds);
  };

  const [SubmitTask] = useMutation(CREATE_TASK);
  const onSubmit = (data) => {
    console.log(createTaskInput);
    if (data) {
      const res = SubmitTask({
        variables: {
          input: {
            title: createTaskInput.title,
            categoryId: createTaskInput.categoryId,
            subCategoryId: createTaskInput.subCategoryId,
            description: createTaskInput.description,
            fileIds: createTaskInput.fileIds,
            currentAssignee: createTaskInput.currentAssignee,
            creationLocLatitude: createTaskInput.creationLocLatitude,
            creationLocLongitude: createTaskInput.creationLocLongitude,
            dueDate: createTaskInput.dueDate,
          },
        },
      });
      console.log("res : ", res);
    } else {
      console.log("fill all required fields");
    }

    // if (data != null) {
    //   // console.log(data);
    //   // formref.current.reset();
    //   toast.success("Submitted Successfully");
    // } else {
    //   toast.error("Fill all required fields");
    // }
  };

  const deleteSelectedRow = (index) => {
    console.log(index);
    let rows = uploadedFile;
    let array = rows;
    setDeleteSelectedFile(array.splice(index, 1));
    setUploadedFile(array);
  };

  //FunctionEnd

  // for getting map location

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
          <form ref={formref} onSubmit={handleSubmit(onSubmit)}>
            <div className="row ">
              <div className="col-xs-12 col-sm-12 col-md-6  ">
                <div className="mt-2">
                  <input
                    type="text"
                    // className="form-control"
                    placeholder="Title"
                    className="box shadow-none border-0 border-bottom w-100 createTaskMandatoryLabel"
                    name="title"
                    {...register("subjectLine", { required: true })}
                    onChange={handleChangeSubjectData}
                  />

                  {errors.subjectLine && (
                    <p className="text-danger"> Title is required</p>
                  )}
                </div>
                <div className="mt-5">
                  <textarea
                    placeholder="Description"
                    name="description"
                    {...register("description", { required: true })}
                    onChange={handleChangeDescriptionData}
                    className="box shadow-none border-0 border-bottom w-100 createTaskMandatoryLabel"
                  />
                  {errors.description && (
                    <p className="text-danger"> Description is required</p>
                  )}
                  <p className="charLeftClass">
                    Document cannot exceed 200 characters
                    {/* Document cannot exceed 200 characters :  {chars_left_description} */}
                  </p>
                </div>
                <div className="mt-5">
                  <Select
                    name="category"
                    placeholder="Category"
                    // className="mt-2 form-control"
                    className=" box shadow-none border-0 border-bottom w-100 createTaskMandatoryLabel"
                    options={
                      categoryResponse.data &&
                      categoryResponse.data.getCategories.map(
                        ({ categoryId: value, name: label }) => ({
                          label,
                          value,
                        })
                      )
                    }
                    onChange={(selectedOption) => {
                      getSubCategory({
                        variables: {
                          categoryId: setCreateTaskInput((prevState) => ({
                            ...prevState,
                            categoryId: selectedOption,
                          })),
                        },
                      });
                    }}
                  ></Select>
                  {errors.category && (
                    <p className="text-danger"> Category is required</p>
                  )}
                </div>

                <div className="mt-5">
                  <select
                    name="subcategory"
                    className="mt-2 border-0 border-bottom w-100 fontSize11"
                    onChange={(e) =>
                      getSubSubCategory({
                        variables: {
                          subCategoryId: setCreateTaskInput((prevState) => ({
                            ...prevState,
                            subCategoryId: e.target.value,
                          })),
                        },
                      })
                    }
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
                </div>
                <div className="mt-5">
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

                <div className="mt-5">
                  <div>
                    {uploadedFile && uploadedFile.length > 0 && (
                      <div className="mt-5">
                        <label className="marginRight1 mt-2">
                          {" "}
                          Attached Files: &nbsp;{" "}
                        </label>
                        <div style={{ "overflow-y": "scroll", height: "50vh" }}>
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 ">
                <div className="mt-5">
                  <Select
                    name="handler"
                    placeholder="Handler"
                    // className="mt-2 form-control"
                    className=" box shadow-none border-0 border-bottom w-100 createTaskMandatoryLabel"
                    onChange={(selectedOption) => {
                      setCreateTaskInput((prevState) => ({
                        ...prevState,
                        currentAssignee: selectedOption,
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
                </div>
                <div className="mt-5">
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

                <div className="mt-5">
                  <div className="d-flex cursor-pointer mt-1">
                    <ReactDatePicker
                      type="text"
                      name="fromDate"
                      placeholderText="Due Date"
                      className="datePickerField col-lg-12 border-0  w-100 border-bottom fontSize11"
                      dateFormat="dd-MM-yyyy"
                      selected={startDate}
                      // onChange={(date) => setStartDate(date)}
                      onChange={(date) => {
                        setStartDate(date);
                        setCreateTaskInput((prevState) => ({
                          ...prevState,
                          dueDate: date,
                        }));
                      }}
                    />
                    <BsCalendar className="mt-1 border-bottom" />
                  </div>
                </div>
                <div className="mt-5 d-flex justify-content-center">
                  <MapComponent
                    position={position}
                    mapError={mapError}
                    mapErrorTxt={mapErrorTxt}
                  />
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col"></div>

              <div className="col"></div>
              <div className="mt-2 mb-5 col">
                <button type="submit" className="form-control btn-clr">
                  {" "}
                  Submit{" "}
                </button>
              </div>
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
