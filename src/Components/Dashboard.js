import { ApolloClient, gql, InMemoryCache, useQuery } from "@apollo/client";
import { React, useEffect, useState } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { FaFilter, FaPlus, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import CardList from "./CardList";
import Filters from "./Filters";
import Footer from "./Footer";
import Graphs from "./Graphs/Graphs";
import NavBar from "./Nav-bar";

const FILTERED_TASK_QUERY = gql`
  query GETALL($request: SearchRequest) {
    getFilteredTasks(request: $request) {
      title
      description
      status
      taskId
      categoryId
      createdBy
      createdByName
      statusName
      currentAssignee
      currentAssigneeName
      dueDate {
        formatString(format: "dd-MMM-yy")
      }
    }
  }
`;

const GET_TASK_FOR_WATCHERS_QUERY = gql`
  query GETALL($userId: ID!) {
    getTasksWatchedBy(userId: $userId) {
      title
      description
      status
      taskId
      categoryId
      createdBy
      createdByName
      statusName
      currentAssignee
      currentAssigneeName
      dueDate {
        formatString(format: "dd-MMM-yy")
      }
    }
  }
`;

const CATEGORY_QUERY = gql`
  {
    getCategories {
      categoryId
      name
      createdBy
    }
  }
`;

const client = new ApolloClient({
  uri: "http://3.110.3.72/graphql",
  cache: new InMemoryCache(),
  fetchOptions: {
    mode: "no-cors",
  },
  headers: {
    "Authentication-Token": "saldfal00965-klal998-jknj",
    userId: "1",
  },
});

function Dashboard({ logoutClick, userDetails }) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [categoryId, setCategoryId] = useState(0);
  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
    setCategoryId(selectedValue.target.value);
  };

  const categoryResponse = useQuery(CATEGORY_QUERY);

  const handleEyeIconClick = (file) => {
    setShowViewDocPopup(true);
  };
  const handleCloseClick = () => setShowViewDocPopup(false);
  const [showViewDocPopup, setShowViewDocPopup] = useState(false);

  const [handlerResponse, setHandlerResponse] = useState();
  const [watcherResponse, setWatcherResponse] = useState();
  const [creatorResponse, setCreatorResponse] = useState();
  const [showLoaderHandler, setShowLoaderHandler] = useState(true);
  const [showLoaderWatcher, setShowLoaderWatcher] = useState(true);
  const [showLoaderCreator, setShowLoaderCreator] = useState(true);

  const today = new Date();

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

  const clientCallforHandlerResponse = (
    sortType = "DESC",
    weekStart,
    endWeek,
    categoryId
  ) => {
    let inputFilters = [];
    if (categoryId == 0) {
      inputFilters = [
        {
          filterKey: "dueDate",
          operator: "BETWEEN",
          values: [weekStart, endWeek],
        },

        // {
        //   filterKey: "currentAssignee",
        //   operator: "EQUAL",
        //   values: ["1"],
        // },
      ];
    } else {
      inputFilters = [
        {
          filterKey: "dueDate",
          operator: "BETWEEN",
          values: [weekStart, endWeek],
        },
        {
          filterKey: "categoryId",
          operator: "EQUAL",
          values: [categoryId],
        },

        // {
        //   filterKey: "currentAssignee",
        //   operator: "EQUAL",
        //   values: ["1"],
        // },
      ];
    }

    client
      .query({
        query: FILTERED_TASK_QUERY,
        variables: {
          request: {
            page: 0,
            size: 10,
            filters: inputFilters,
            sorts: [
              {
                key: "status",
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

  const clientCallforCreatorResponse = (
    sortType = "DESC",
    weekStart,
    endWeek,
    categoryId
  ) => {
    let inputFilters = [];
    if (categoryId == 0) {
      inputFilters = [
        {
          filterKey: "dueDate",
          operator: "BETWEEN",
          values: [weekStart, endWeek],
        },

        // {
        //   filterKey: "currentAssignee",
        //   operator: "EQUAL",
        //   values: ["1"],
        // },
      ];
    } else {
      inputFilters = [
        {
          filterKey: "dueDate",
          operator: "BETWEEN",
          values: [weekStart, endWeek],
        },
        {
          filterKey: "categoryId",
          operator: "EQUAL",
          values: [categoryId],
        },

        // {
        //   filterKey: "currentAssignee",
        //   operator: "EQUAL",
        //   values: ["1"],
        // },
      ];
    }
    client
      .query({
        query: FILTERED_TASK_QUERY,
        variables: {
          request: {
            page: 0,
            size: 10,
            filters: inputFilters,
            sorts: [
              {
                key: "status",
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
          userId: 18,
        },
      })
      .then((response) => {
        console.log("watcher respose ", response);
        setShowLoaderWatcher(false);
        setWatcherResponse(response);
      })
      .catch((err) => console.error(err));
  };

  const nextweek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );

  useEffect(() => {
    let startWeek = currentWeek();
    let endWeek = formatDate(new Date());
    clientCallforHandlerResponse("DESC", startWeek, endWeek, categoryId);
    clientCallforCreatorResponse("DESC", startWeek, endWeek, categoryId);
    clientCallForWatcherResponse();
  }, []);

  const [defDescSortHandler, setDefSortHandler] = useState(true);
  const [defDescSortCreator, setDefSortCreator] = useState(true);
  const [defDescSortWatcher, setDefSortWatcher] = useState(true);

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
      clientCallforCreatorResponse("ASC", stDate, edDate, categoryId);
    } else {
      clientCallforCreatorResponse("DESC", stDate, edDate, categoryId);
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
    console.log("submit", e.target.name);
    let tabType = e.target.name;

    console.log("submit");
    console.log(startDate ? startDate : nextweek);
    console.log(endDate);
    console.log(categoryId);
    let stDate = formatDate(startDate ? startDate : nextweek);
    let edDate = formatDate(endDate);
    console.log(stDate);
    console.log(edDate);

    if (tabType == "handler") {
      clientCallforHandlerResponse("DESC", stDate, edDate, categoryId);
    } else {
      clientCallforCreatorResponse("DESC", stDate, edDate, categoryId);
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
                      <div className="show-mobile-icons">
                        <div>
                          <CardList response={handlerResponse} />
                        </div>
                      </div>
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
                          <div className="show-mobile-icons">
                            <div>
                              <CardList response={watcherResponse} />
                            </div>
                          </div>
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
                      <div className="show-mobile-icons">
                        <div>
                          <CardList response={creatorResponse} />
                        </div>
                      </div>
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
