import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import APIService from "../../Services/APIService";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";
import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";

const CATEGORY_QUERY = gql`
  {
    getCategories {
      categoryId
      name
      createdBy
    }
  }
`;

const GET_DASHBOARD_QUERY = gql`
  query GETFILTERED_QUERY($request: SearchRequest) {
    getFilteredTasks(request: $request) {
      status
    }
  }
`;

function Graphs() {
  const [category, setCategory] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [taskStatus, setTaskStatus] = useState([]);
  const apiService = new APIService();
  const currentWeek = () => {
    let d = new Date(new Date());
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

    let weekofDay = new Date(d.setDate(diff));
    console.log(weekofDay);
    return weekofDay;
  };
  const categoryResponse = useQuery(CATEGORY_QUERY);
  const getChartResponse = useQuery(GET_DASHBOARD_QUERY, {
    variables: {
      request: {
        page: 1,
        size: 10,
      },
    },
  });

  console.log("---", getChartResponse);

  const status = [
    {
      id: 0,
      status: "Initiated",
    },
    {
      id: 1,
      status: "Assigned",
    },
    {
      id: 2,
      status: "In Progress",
    },
    {
      id: 3,
      status: "Reassigned",
    },
    {
      id: 4,
      status: "Resolved",
    },
    {
      id: 5,
      status: "Closed",
    },
    {
      id: 6,
      status: "Reopened",
    },
  ];

  useEffect(() => {
    console.log(currentWeek());
    setStartDate(currentWeek);
  }, []);

  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
  };

  return (
    <div>
      <div className="container ">
        <div className="row">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header></Accordion.Header>
              <Accordion.Body>
                <div className="row">
                  <div className=" col">
                    <label className=" w-100">
                      {" "}
                      <span className="filter-span-header">Start Date</span>
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
                  <div className=" col">
                    <label className="w-100">
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
                  <div className=" col">
                    <label>
                      <span className="filter-span-header">Category</span>{" "}
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
                              <option key={index} value={item.categoryId}>
                                {item.name}
                              </option>
                            );
                          }
                        )}
                    </select>
                  </div>

                  <div className=" col d-flex align-items-end">
                    <div className="">
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
      </div>
      <br />

      <div className="row">
        <div className="col-xs-2 col-sm-2 col-lg-2 col-md-2"></div>
        {/* <div className="col"></div> */}
        <div className="col-xs-8 col-sm-8 col-lg-8 col-md-8">
          {getChartResponse.data && (
            <PieChart getChartResponse={getChartResponse.data} />
          )}
        </div>
        {/* <div className="col"></div> */}
        <div className="col-xs-2 col-sm-2 col-lg-2 col-md-2"></div>
        {/* <div className=" col-xs-6 col-sm-6 col-md-12 col-lg-12 "></div>
        <div className="col-xs-6 col-sm-6 col-md-12 col-lg-6 "> */}
        {/* <BarGraph /> */}
        {/* </div> */}
      </div>
    </div>
  );
}

export default Graphs;
