import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import APIService from "../../Services/APIService";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";

function Graphs() {
  const [category, setCategory] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [taskStatus, setTaskStatus] = useState([]);
  const apiService = new APIService();
  useEffect(() => {
    apiService
      .request("category")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        let catgry = myJson;
        setCategory(catgry);
      })
      .catch((error) => {
        console.log(error);
      });
    apiService
      .request("taskStatus")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        let catgry = myJson;
        setTaskStatus(catgry);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
    // let key = selectedValue.target.value;
  };

  return (
    <div>
      <div className="container ">
        <div className="row">
          <div className=" col-sm-3 col-lg-3 col-md-3 col-xs-3">
            <label className=" w-100">
              {" "}
              <span className="asterisk_input ">Start Date</span>
              <div className="d-flex form-control cursor-pointer mt-2">
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
          <div className=" col-sm-3 col-lg-3 col-md-3 col-xs-3">
            <label className="w-100">
              {" "}
              <span className="asterisk_input ">End Date</span>
              <div className="d-flex form-control cursor-pointer mt-2">
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
          <div className=" col-sm-3 col-lg-3 col-md-3 col-xs-3">
            <label> Category </label>
            <select
              onChange={handleCategoryChange}
              className="mt-2 form-control"
            >
              <option value="">Choose..</option>
              {category &&
                category.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className=" col-sm-3 col-lg-3 col-md-3 col-xs-3">
            <label> Task Status </label>
            <select
              onChange={handleCategoryChange}
              className="mt-2 form-control"
            >
              <option value="">Choose..</option>
              {taskStatus &&
                taskStatus.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className=" col-xs-6 col-sm-6 col-md-12 col-lg-6 ">
          <BarGraph />
          {/* <LineChart /> */}
        </div>
        <div className="col-xs-6 col-sm-6 col-md-12 col-lg-6 ">
          <PieChart />
        </div>
      </div>
    </div>
  );
}

export default Graphs;
