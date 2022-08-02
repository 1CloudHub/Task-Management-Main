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
import { FaEye, FaTimes, FaTrash } from "react-icons/fa";
import Select from "react-select";

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

  const handleChangeFileData = (event) => {
    // console.log(event);
    setUploadedFile([...event.target.files]);
    setFile(event.target.files);
    let array = [];
    array.push(event.target.files[0]);
    setCreateTaskInput((prevState) => ({
      ...prevState,
      fileIds: array,
    }));
    console.log(createTaskInput.fileIds);
  };

  const [SubmitTask] = useMutation(CREATE_TASK);
  const onSubmit = (data) => {
    console.log(createTaskInput);
    const res = SubmitTask({
      variables: {
        input: {
          title: createTaskInput.title,
          categoryId: createTaskInput.categoryId,
          subCategoryId: createTaskInput.subCategoryId,
          description: createTaskInput.description,
          // fileIds: createTaskInput.fileIds,
          currentAssignee: createTaskInput.currentAssignee,
          creationLocLatitude: createTaskInput.creationLocLatitude,
          creationLocLongitude: createTaskInput.creationLocLongitude,
        },
      },
    });

    console.log("res : ", res);

    if (data != null) {
      // console.log(data);
      // formref.current.reset();
      toast.success("Submitted Successfully");
    } else {
      toast.error("Fill all required fields");
    }
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
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />

      <br />
      <div className="container main-container mb-5">
        <div>
          <form ref={formref} onSubmit={handleSubmit(onSubmit)}>
            <div className="row ">
              <div className="col-xs-12 col-sm-12 col-md-6  ">
                <div className="mt-2">
                  <label className="asterisk_input"> Title </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    {...register("subjectLine", { required: true })}
                    onChange={handleChangeSubjectData}
                  />

                  {errors.subjectLine && (
                    <p className="text-danger"> Title is required</p>
                  )}
                </div>
                <div className="mt-2">
                  <label className="asterisk_input"> Description </label>
                  <textarea
                    name="description"
                    {...register("description", { required: true })}
                    onChange={handleChangeDescriptionData}
                    className="form-control mt-2 "
                  >
                    {" "}
                  </textarea>
                  {errors.description && (
                    <p className="text-danger"> Description is required</p>
                  )}
                  <p className="charLeftClass">
                    Characters Left: {chars_left_description}
                  </p>
                </div>
                <div className="mt-2">
                  <label className="asterisk_input"> Category </label>
                  <select
                    name="category"
                    className="mt-2 form-control"
                    {...register("category", { required: true })}
                    onChange={(e) =>
                      getSubCategory({
                        variables: {
                          categoryId: setCreateTaskInput((prevState) => ({
                            ...prevState,
                            categoryId: e.target.value,
                          })),
                        },
                      })
                    }
                  >
                    <option value="">Choose..</option>
                    {categoryResponse.data &&
                      categoryResponse.data.getCategories.map((item, index) => {
                        return (
                          <option key={index} value={item.categoryId}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                  {errors.category && (
                    <p className="text-danger"> Category is required</p>
                  )}
                </div>

                <div className="mt-2 ">
                  <label className="asterisk_input"> Sub Category </label>
                  <select
                    name="subcategory"
                    {...register("subcategory", { required: true })}
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
                    className="mt-2 form-control"
                  >
                    <option value="">Choose..</option>
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
                  {errors.subcategory && (
                    <p className="text-danger"> Sub Category is required</p>
                  )}
                </div>
                <div className="mt-2">
                  <label> Sub Sub Category </label>
                  <select
                    name="subsubcategory"
                    className="mt-2 form-control"
                    onChange={(e) => {
                      setCreateTaskInput((prevState) => ({
                        ...prevState,
                        subSubCategoryId: parseInt(e.target.value),
                      }));
                    }}
                  >
                    <option value="">Choose..</option>
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

                <div className="mt-2">
                  <label className="asterisk_input"> Handler </label>
                  <select
                    name="category"
                    className="mt-2 form-control"
                    onChange={(e) => {
                      setCreateTaskInput((prevState) => ({
                        ...prevState,
                        currentAssignee: e.target.value,
                      }));
                    }}
                    {...register("handler", { required: true })}
                  >
                    <option value="">Choose..</option>
                    {userResponse.data &&
                      userResponse.data.getUsers.map((item, index) => {
                        return (
                          <option key={index} value={item.userId}>
                            {item.emailAddress}
                          </option>
                        );
                      })}
                  </select>
                  {errors.handler && (
                    <p className="text-danger"> Handler is required</p>
                  )}
                </div>
                <div className="mt-2">
                  <label> Watcher </label>

                  <Select
                    name="watcher"
                    className="rounded-0"
                    required={true}
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

                <div className="mt-1">
                  <label className="marginRight1 mt-1">
                    {" "}
                    Attach Document : &nbsp;
                    <input
                      type="file"
                      className="mt-2"
                      name="fileAttach"
                      onChange={handleChangeFileData}
                      multiple
                    />
                    {/* <Link to="#" className="mt-2">
                  {" "}
                  Relate to previous Task?
                </Link> */}
                  </label>
                  {/* Document Viewer */}
                  {uploadedFile && uploadedFile.length > 0 && (
                    <div className="document-viewer mt-2">
                      <strong className="">Uploaded Files</strong>
                      <Table responsive className="border mt-2">
                        <tbody>
                          {uploadedFile.map((file, index) => {
                            return (
                              <tr key={index}>
                                <td style={{ width: "85%" }}> {file.name} </td>
                                <td>
                                  {" "}
                                  <FaEye
                                    onClick={() => handleEyeIconClick(file)}
                                  />{" "}
                                </td>
                                <td>
                                  {" "}
                                  <FaTrash
                                    onClick={() => deleteSelectedRow(index)}
                                  />{" "}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 ">
                <div className="mt-2">
                  <label className=""> Relate to previous task </label>
                  <div className=" ">
                    <div className="input-group mt-2">
                      <input
                        type="text"
                        list="search"
                        className="form-control search-bar w-100"
                        placeholder="search "
                        aria-describedby="basic-addon2"
                      />
                      <span
                        className="input-view-icon cursor-pointer"
                        id="basic-addon2"
                        title="view"
                      >
                        <GrView className="mt-1 mb-1" />
                      </span>
                      <datalist id="search">
                        <option>Deposit</option>
                        <option>Loan</option>
                        <option>Interest</option>
                        <option>Finance</option>
                      </datalist>
                    </div>

                    {/* </div> */}
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
                <div className="mt-3 d-flex justify-content-center">
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
        <Modal show={showViewDocPopup}>
          <Modal.Header>
            <div>{selectedFileName}</div>
            <FaTimes onClick={handleCloseClick} />{" "}
          </Modal.Header>
          <Modal.Body>
            <img src={popUpImage} style={{ width: "50vh" }} />
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
