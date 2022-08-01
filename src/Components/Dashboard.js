import { React, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Footer from "./Footer";
import Graphs from "./Graphs/Graphs";
import AppNavBar from "./MIUI/AppNavBar";
import SideNavDrawer from "./MIUI/SideNavDrawer";
import NavBar from "./Nav-bar";
import TableList from "./TableList";
import { useQuery, gql } from "@apollo/client";
import CreatorTableList from "./Graphs/CreatorTableList";
import WatcherTableList from "./WatcherTableList";
import { getUser } from "react-oidc-client";
import { FaPlus, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import CardList from "./CardList";
import Accordion from "react-bootstrap/Accordion";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";

const FILTERED_TASK_QUERY = gql`
  query GETALL($request: SearchRequest) {
    getFilteredTasks(request: $request) {
      title
      description
      status
      taskId
      categoryId
      createdBy
      currentAssignee
      dueDate {
        formatString(format: "MM-dd-yyyy")
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
function Dashboard({ logoutClick, userDetails }) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const forHandlerResponse = useQuery(FILTERED_TASK_QUERY, {
    variables: {
      request: {
        page: 0,
        size: 10,
        filters: [
          {
            filterKey: "categoryId",
            operator: "EQUAL",
            values: ["1"],
          },
        ],
        sorts: [
          {
            key: "taskId",
            direction: "DESC",
          },
        ],
      },
    },
  });
  const forCreatorResponse = useQuery(FILTERED_TASK_QUERY, {
    variables: {
      request: {
        page: 0,
        size: 10,
      },
      filters: [
        {
          filterKey: "createdBy",
          operator: "EQUAL",
          values: ["1"],
        },
      ],
      sorts: [
        {
          key: "taskId",
          direction: "DESC",
        },
      ],
    },
  });
  const forWatcherResponse = useQuery(FILTERED_TASK_QUERY, {
    variables: {
      request: {
        page: 0,
        size: 10,
      },
      filters: [
        {
          filterKey: "categoryId",
          operator: "EQUAL",
          values: ["1"],
        },
      ],
      sorts: [
        {
          key: "taskId",
          direction: "DESC",
        },
      ],
    },
  });
  const categoryResponse = useQuery(CATEGORY_QUERY);
  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
  };

  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      {/* <AppNavBar />
      <SideNavDrawer /> */}
      <br />
      <br />

      <div className="main-container">
        <div className="container-fluid">
          <div className="marginLeft5">
            <h5 className="themeColor"> Dashboard </h5>
          </div>
          <Tabs
            defaultActiveKey="handle"
            id="dashboard-nav-tab-id"
            className="mb-3 text-danger dashboard-tabs"
          >
            <Tab className="dashboard-tab" eventKey="handle" title="Handler">
              {forHandlerResponse.data && (
                <>
                  <div className="row d-flex">
                    <div className="col-xs-6 col-sm-6 col-md-8 col-lg-8">
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <FaFilter />
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="row">
                              <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                <label className=" w-100">
                                  {" "}
                                  <span className="filter-span-header">
                                    Start Date
                                  </span>
                                  <div className="d-flex form-control cursor-pointer ">
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
                              <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                <label className="w-100">
                                  {" "}
                                  <span className="filter-span-header">
                                    End Date
                                  </span>
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
                                  <span className="filter-span-header">
                                    Category
                                  </span>{" "}
                                </label>
                                <select
                                  onChange={handleCategoryChange}
                                  className=" form-control"
                                >
                                  <option value="">All</option>
                                  {categoryResponse.data &&
                                    categoryResponse.data.getCategories.map(
                                      (item, index) => {
                                        return (
                                          <option
                                            key={index}
                                            value={item.categoryId}
                                          >
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
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
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                      <FaSortAmountDown />
                    </div>
                  </div>
                  <br />
                  <CardList />
                  <TableList response={forHandlerResponse} />
                  <Graphs response={forHandlerResponse} />
                </>
              )}
            </Tab>
            <Tab eventKey="watch" title="Watcher">
              <TableList columns={""} />
              <Graphs />

              <WatcherTableList />
            </Tab>
            <Tab eventKey="create" title="Creator">
              <CreatorTableList />
              <Graphs />
            </Tab>
          </Tabs>
        </div>
      </div>
      <Link to="/AddTask" className="float">
        <FaPlus className="mt-3" />
      </Link>
      <Footer />
    </div>
  );
}

export default Dashboard;
