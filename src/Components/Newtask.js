import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";
import React, { useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { BsCalendar } from "react-icons/bs";
import { GrView } from "react-icons/gr";
import { toast } from "react-toastify";
import Footer from "./Footer";
import NavBar from "./Nav-bar";

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
      subSubCategoryId
      dueDate {
        formatString(format: "dd/MM/yyyy")
      }
    }
  }
`;

function Newtask({ logoutClick, userDetails }) {
  const formref = useRef();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [categoryId, setCategoryId] = useState("");
  const [createTaskInput, setCreateTaskInput] = useState({
    categoryId: "",
    subCategoryId: "",
    subSubCategoryId: "",
    currentAssignee: "",
    title: "",
    description: "",
    dueDate: "",
    lat: "",
    lon: "",
    refTaskId: "",
    notes: "",
    fileIds: [],
  });

  const [getSubCategory, subCategoryResponse] =
    useLazyQuery(SUB_CATEGORY_QUERY);
  // console.log("subCategoryResponse : ", subCategoryResponse);
  const [getSubSubCategory, subsubCategoryResponse] = useLazyQuery(
    SUB_SUB_CATEGORY_QUERY
  );

  const [chars_left_description, setCharsLeftDescription] = useState(125);
  const [chars_left_subject, setCharsLeftSubject] = useState(125);
  const [data, setData] = useState();
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

  const handleChangeFileData = ({ target: { name, files } }) => {
    setCreateTaskInput((prevState) => ({ ...prevState, fileIds: files[0] }));
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
          fileIds: createTaskInput.fileIds,
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

  const categoryResponse = useQuery(CATEGORY_QUERY);

  const [startDate, setStartDate] = useState("");

  return (
    <div className="main ">
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />

      <br />
      <div className="container main-container mb-5">
        <h5 className="themeColor"> Add New Task </h5>
        <div>
          <form ref={formref} onSubmit={handleSubmit(onSubmit)}>
            <div className="row ">
              <div className="col-xs-12 col-sm-12 col-md-6  ">
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
                    onChange={handleChangeData}
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
                <div className="mt-1">
                  <label className="asterisk_input"> Subject Line </label>

                  <textarea
                    name="description"
                    className="form-control mt-1 "
                    {...register("subjectLine", { required: true })}
                    onChange={handleChangeSubjectData}
                  />

                  {errors.subjectLine && (
                    <p className="text-danger"> Subject Line is required</p>
                  )}
                  <p className="charLeftClass">
                    Characters Left: {chars_left_subject}
                  </p>
                </div>
                <div className="mt-3">
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
              <div className="col-xs-12 col-sm-12 col-md-6 ">
                {/* <MapComponent getLat={checkFun} /> */}
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
    </div>
  );
}

export default Newtask;
