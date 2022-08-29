import { useQuery } from "@apollo/client";
import { React, useEffect, useState } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Client } from "../Services/HeadersConfig";
import {
  CATEGORY_LIST_QUERY,
  FILTERED_TASK_QUERY,
  GET_TASK_FOR_WATCHERS_QUERY,
} from "../Services/Query";
import CardList from "./CardList";
import Filters from "./Filters";
import Footer from "./Footer";
import Graphs from "./Graphs/Graphs";
import NavBar from "./Nav-bar";

const client = Client;

function Dashboard({ logoutClick, userDetails }) {
  const userId = localStorage.getItem("userId");

  const [startDate, setStartDate] = useState();
  const today = new Date();
  const [endDate, setEndDate] = useState(new Date());
  const [categoryId, setCategoryId] = useState(0);
  const [statusId, setStatusId] = useState(0);

  const [showViewDocPopup, setShowViewDocPopup] = useState(false);
  const [handlerResponse, setHandlerResponse] = useState();
  const [watcherResponse, setWatcherResponse] = useState();
  const [creatorResponse, setCreatorResponse] = useState();
  const [showLoaderHandler, setShowLoaderHandler] = useState(true);
  const [showLoaderWatcher, setShowLoaderWatcher] = useState(true);
  const [showLoaderCreator, setShowLoaderCreator] = useState(true);
  const [defDescSortHandler, setDefSortHandler] = useState(true);
  const [defDescSortCreator, setDefSortCreator] = useState(true);
  const [defDescSortWatcher, setDefSortWatcher] = useState(true);

  const nextweek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
    setCategoryId(selectedValue.target.value);
  };
  const handleCloseClick = () => setShowViewDocPopup(false);
  const handleEyeIconClick = (file) => {
    setShowViewDocPopup(true);
  };

  const clientCallforHandlerResponse = (
    sortType = "DESC",
    weekStart,
    endWeek,
    categoryId,
    statusId
  ) => {
    getInputFilters(
      weekStart,
      endWeek,
      categoryId,
      statusId,
      "currentAssignee"
    );

    client
      .query({
        query: FILTERED_TASK_QUERY,
        variables: {
          request: {
            page: 0,
            size: 10,
            filters: getInputFilters(
              weekStart,
              endWeek,
              categoryId,
              statusId,
              "currentAssignee"
            ),
            sorts: [
              {
                key: "dueDate",
                direction: sortType,
              },
            ],
          },
        },
      })
      .then((response) => {
        console.log("handler response : ", response);
        setShowLoaderHandler(false);
        setHandlerResponse(response);
      })
      .catch((err) => console.error(err));
  };

  const getInputFilters = (
    weekStart,
    endWeek,
    categoryId,
    statusId,

    type
  ) => {
    let inputFilters = [];
    if (categoryId == 0 && statusId == 0) {
      inputFilters = [
        {
          filterKey: "createdDate",
          operator: "BETWEEN",
          values: [weekStart, endWeek],
        },

        {
          filterKey: type,
          operator: "EQUAL",
          values: [userId],
        },
      ];
    } else if (categoryId != 0 && statusId == 0) {
      inputFilters = [
        {
          filterKey: "createdDate",
          operator: "BETWEEN",
          values: [weekStart, endWeek],
        },

        {
          filterKey: type,
          operator: "EQUAL",
          values: [userId],
        },
        {
          filterKey: "categoryId",
          operator: "EQUAL",
          values: [categoryId],
        },
      ];
    } else if (categoryId == 0 && statusId != 0) {
      inputFilters = [
        {
          filterKey: "createdDate",
          operator: "BETWEEN",
          values: [weekStart, endWeek],
        },

        {
          filterKey: type,
          operator: "EQUAL",
          values: [userId],
        },

        {
          filterKey: "status",
          operator: "EQUAL",
          values: [statusId],
        },
      ];
    } else {
      inputFilters = [
        {
          filterKey: "createdDate",
          operator: "BETWEEN",
          values: [weekStart, endWeek],
        },

        {
          filterKey: type,
          operator: "EQUAL",
          values: [userId],
        },
        {
          filterKey: "categoryId",
          operator: "EQUAL",
          values: [categoryId],
        },
        {
          filterKey: "status",
          operator: "EQUAL",
          values: [statusId],
        },
      ];
    }
    return inputFilters;
  };

  const clientCallforCreatorResponse = (
    sortType = "DESC",
    weekStart,
    endWeek,
    categoryId,
    statusId
  ) => {
    getInputFilters(weekStart, endWeek, categoryId, statusId, "createdBy");

    client
      .query({
        query: FILTERED_TASK_QUERY,
        variables: {
          request: {
            page: 0,
            size: 10,
            filters: getInputFilters(
              weekStart,
              endWeek,
              categoryId,
              statusId,
              "createdBy"
            ),
            sorts: [
              {
                key: "dueDate",
                direction: sortType,
              },
            ],
          },
        },
      })
      .then((response) => {
        console.log("creator respose ", response);
        setShowLoaderCreator(false);
        setCreatorResponse(response);
      })
      .catch((err) => console.error(err));
  };

  const clientCallForWatcherResponse = () => {
    client
      .query({
        query: GET_TASK_FOR_WATCHERS_QUERY,
        variables: {
          userId: 1,
        },
      })
      .then((response) => {
        console.log("watcher respose ", response);
        setShowLoaderWatcher(false);
        setWatcherResponse(response);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    let startWeek = currentWeek();
    let endWeek = formatDate(new Date());
    clientCallforHandlerResponse(
      "DESC",
      startWeek,
      endWeek,
      categoryId,
      statusId
    );
    clientCallforCreatorResponse(
      "DESC",
      startWeek,
      endWeek,
      categoryId,
      statusId
    );
    clientCallForWatcherResponse();
  }, []);
  const categoryResponse = useQuery(CATEGORY_LIST_QUERY);

  const handleStatusChange = (e) => {
    console.log(e.target.value);
    setStatusId(e.target.value);
  };
  const currentWeek = () => {
    let d = new Date(new Date());

    const lastWeekDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate() - 7
    );
    console.log(lastWeekDate);
    let formatedDate = formatDate(lastWeekDate);
    return formatedDate;
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

  const handleSorterforHandler = () => {
    console.log("sort for handler   ");
    console.log("categoryId : ", categoryId);

    let stDate = formatDate(startDate);
    let edDate = formatDate(endDate);
    console.log(stDate);
    console.log(edDate);
    setDefSortHandler(!defDescSortHandler);
    if (defDescSortHandler) {
      clientCallforHandlerResponse("ASC", stDate, edDate, categoryId);
    } else {
      clientCallforHandlerResponse("DESC", stDate, edDate, categoryId);
    }
  };

  const handleSorterforCreator = () => {
    console.log("sort for creator");
    console.log("categoryId : ", categoryId);

    let stDate = formatDate(startDate);
    let edDate = formatDate(endDate);
    console.log(stDate);
    console.log(edDate);
    setDefSortCreator(!defDescSortCreator);
    if (defDescSortCreator) {
      clientCallforCreatorResponse("ASC", stDate, edDate, categoryId, statusId);
    } else {
      clientCallforCreatorResponse(
        "DESC",
        stDate,
        edDate,
        categoryId,
        statusId
      );
    }
  };

  const handleSorterforWatcher = () => {
    console.log("sort for watcher");
    console.log("categoryId : ", categoryId);

    let stDate = formatDate(startDate);
    let edDate = formatDate(endDate);
    console.log(stDate);
    console.log(edDate);
    setDefSortWatcher(!defDescSortWatcher);
    if (defDescSortWatcher) {
      clientCallForWatcherResponse("ASC", stDate, edDate, categoryId);
    } else {
      clientCallForWatcherResponse("DESC", stDate, edDate, categoryId);
    }
  };

  const handleStart = (date) => {
    setStartDate(date);
  };
  const handleEnd = (date) => {
    setEndDate(date);
  };
  const submitFilter = (e) => {
    e.preventDefault();
    setShowLoaderCreator(true);
    setShowLoaderHandler(true);
    setShowLoaderWatcher(true);

    console.log("submit", e.target.name);
    let tabType = e.target.name;

    console.log("submit");
    console.log(startDate ? startDate : nextweek);
    console.log(endDate);
    console.log(categoryId);
    console.log(statusId);
    let stDate = formatDate(startDate ? startDate : nextweek);
    let edDate = formatDate(endDate);
    console.log(stDate);
    console.log(edDate);

    if (tabType == "handler") {
      clientCallforHandlerResponse(
        "DESC",
        stDate,
        edDate,
        categoryId,
        statusId
      );
    } else {
      clientCallforCreatorResponse(
        "DESC",
        stDate,
        edDate,
        categoryId,
        statusId
      );
    }

    e.preventDefault();
    return;
  };

  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      {/* <AppNavBar />
      <SideNavDrawer /> */}
      <br />
      {/* <br /> */}

      <div className="main-container">
        <div className="container-fluid">
          <Tabs
            defaultActiveKey="handle"
            id="dashboard-nav-tab-id"
            className="mb-2 text-danger dashboard-tabs"
          >
            {/* handler */}
            <Tab className="dashboard-tab" eventKey="handle" title="Handler">
              <Filters
                handleSorter={handleSorterforHandler}
                handleEyeIconClick={handleEyeIconClick}
                categoryResponse={categoryResponse}
                submitFilter={submitFilter}
                startDate={startDate ? startDate : nextweek}
                endDate={endDate}
                handleCategoryChange={handleCategoryChange}
                handleStart={handleStart}
                handleEnd={handleEnd}
                tabType={"handler"}
                defSortType={defDescSortHandler}
                handleStatusChange={handleStatusChange}
              />
              {showLoaderHandler && (
                <>
                  <div class="d-flex justify-content-center align-items-center loader">
                    <div class="spinner-border" role="status"></div>
                  </div>
                </>
              )}
              {handlerResponse && (
                <>
                  {handlerResponse.data.getFilteredTasks.length == 0 ? (
                    <>
                      <br />
                      <div className="card d-flex justify-content-center align-items-center text-danger border-0">
                        <div className="card-body">No data</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <CardList response={handlerResponse} />
                      <Graphs response={handlerResponse} />
                    </>
                  )}
                </>
              )}
            </Tab>
            {/* Watcher */}
            <Tab eventKey="watch" title="Watcher">
              {watcherResponse && (
                <>
                  <Filters
                    handleSorter={handleSorterforWatcher}
                    handleEyeIconClick={handleEyeIconClick}
                    categoryResponse={categoryResponse}
                    submitFilter={submitFilter}
                    startDate={startDate ? startDate : nextweek}
                    endDate={endDate}
                    handleCategoryChange={handleCategoryChange}
                    handleStart={handleStart}
                    handleEnd={handleEnd}
                    tabType={"watcher"}
                    defSortType={defDescSortWatcher}
                    handleStatusChange={handleStatusChange}
                  />
                  {showLoaderWatcher && (
                    <>
                      <div class="d-flex justify-content-center align-items-center loader">
                        <div class="spinner-border" role="status"></div>
                      </div>
                    </>
                  )}
                  {watcherResponse && (
                    <>
                      {watcherResponse.data.getTasksWatchedBy.length == 0 ? (
                        <>
                          <br />
                          <div className="card d-flex justify-content-center align-items-center text-danger border-0">
                            <div className="card-body border-0">No data</div>
                          </div>
                        </>
                      ) : (
                        <>
                          {" "}
                          <CardList response={watcherResponse} />
                          <Graphs response={watcherResponse} />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Tab>
            {/* Creator */}
            <Tab eventKey="create" title="Creator">
              <Filters
                handleSorter={handleSorterforCreator}
                handleEyeIconClick={handleEyeIconClick}
                categoryResponse={categoryResponse}
                submitFilter={submitFilter}
                startDate={startDate ? startDate : nextweek}
                endDate={endDate}
                handleCategoryChange={handleCategoryChange}
                handleStart={handleStart}
                handleEnd={handleEnd}
                tabType={"creator"}
                defSortType={defDescSortCreator}
              />
              {showLoaderCreator && (
                <>
                  <div class="d-flex justify-content-center align-items-center loader">
                    <div class="spinner-border" role="status"></div>
                  </div>
                </>
              )}
              {creatorResponse && (
                <>
                  {creatorResponse.data.getFilteredTasks.length == 0 ? (
                    <>
                      <br />
                      <div className="card d-flex justify-content-center align-items-center text-danger border-0">
                        <div className="card-body border-0">No data</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <CardList response={creatorResponse} />
                      <Graphs response={creatorResponse} />
                    </>
                  )}
                </>
              )}
            </Tab>
          </Tabs>
        </div>
      </div>
      <Link to="/AddTask" className="float">
        <FaPlus className="mt-3" />
      </Link>
      <Modal show={showViewDocPopup}>
        <Modal.Header>
          <div>Filter</div>
          <FaTimes onClick={handleCloseClick} />{" "}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={submitFilter}>
            <div className="row">
              <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <label className=" w-100 mb-1">
                  {" "}
                  <span className="filter-span-header">Start Date</span>
                  <div className="d-flex form-control cursor-pointer ">
                    <ReactDatePicker
                      type="text"
                      name="fromDate"
                      className="datePickerField col-lg-12 border-0 "
                      dateFormat="dd-MM-yyyy"
                      selected={startDate ? startDate : nextweek}
                      placeholderText="start date"
                      onChange={(date) => setStartDate(date)}
                    />
                    <BsCalendar className="mt-1" />
                  </div>
                </label>
              </div>
              <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <label className="w-100 mb-1">
                  {" "}
                  <span className="filter-span-header">End Date</span>
                  <div className="d-flex form-control cursor-pointer ">
                    <ReactDatePicker
                      type="text"
                      name="fromDate"
                      className="datePickerField col-lg-12 border-0 "
                      dateFormat="dd-MM-yyyy"
                      minDate={startDate}
                      selected={endDate}
                      placeholderText="end date"
                      onChange={(date) => setEndDate(date)}
                    />
                    <BsCalendar className="mt-1" />
                  </div>
                </label>
              </div>
              <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <label>
                  <span className="filter-span-header">Category</span>{" "}
                </label>
                <select
                  onChange={handleCategoryChange}
                  className=" form-control"
                >
                  <option value="">All</option>
                  {categoryResponse.data &&
                    categoryResponse.data.getCategories.map((item, index) => {
                      return (
                        <option key={index} value={item.categoryId}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <div className="text-center pt-3">
                  <button
                    type="submit"
                    className="btn btn-clr rounded-0 filter-btn-submit"
                  >
                    submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Footer />
    </div>
  );
}

export default Dashboard;
