import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import APIService from "../Services/APIService";

function TableList() {
  const apiService = new APIService();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  let key = 0;
  const columns = [
    {
      dataField: "id",
      text: "Task ID",
      classes: "tableColumn",
      events: {
        onClick: (e, column, columnIndex, row) => {
          console.log("eeeeeeeeeeee", row);
          navigate(`/ManageTask/${row.id}`);
        },
      },
      // <Link to={`/TaskHistory`}>{cellInfo.row.original.id}</Link>
    },
    {
      dataField: "category",
      text: "Category Name",
      classes: "tableColumn",
      events: {
        onClick: (e, column, columnIndex, row) => {
          navigate(`/ManageTask/${row.id}`);
        },
      },
    },
    {
      dataField: "subCatagory",
      text: "Sub Category",
    },
    {
      dataField: "subSubCatagory",
      text: "Sub Sub Category",
    },
    {
      dataField: "subject",
      text: "Subject",
    },
    {
      dataField: "taskStatus",
      text: "Task Status",
    },
    {
      dataField: "createdOn",
      text: "Created On",
    },
    {
      dataField: "createdBy",
      text: "Created By",
    },
    {
      dataField: "assignedTo",
      text: "Assigned To",
    },
  ];
  const { SearchBar, ClearSearchButton } = Search;

  const [data, setData] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  useEffect(() => {
    apiService
      .request("category")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCategory(data);
      })
      .catch(() => {});
    apiService
      .request("dashboardTableData")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch(() => {});
    apiService
      .request("taskStatus")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTaskStatus(data);
      })
      .catch(() => {});
  }, []);
  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
    key = selectedValue.target.value;

    setData((prevState) => ({ ...prevState, category: key }));
  };

  return (
    <>
      <div className="container-fluid ">
        <div className="container">
          <div className=" row ">
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
                    selected={startDate}
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
        <ToolkitProvider keyField="id" data={data} columns={columns} search>
          {(props) => (
            <>
              <div className="d-flex justify-content-between mb-1">
                <h5>Table List </h5>
                <div className="d-flex">
                  <SearchBar
                    placeholder="search.."
                    className="mr-3  "
                    {...props.searchProps}
                  />{" "}
                  &nbsp;
                  <ClearSearchButton
                    className="btn btn-clr rounded-0"
                    {...props.searchProps}
                  />
                </div>
              </div>
              <BootstrapTable
                keyField="id"
                classes="mobile-responsive table-responsive"
                rowClasses={"cursor-pointer"}
                {...props.baseProps}
                pagination={paginationFactory({
                  sizePerPage: 5,
                  showTotal: true,
                  // paginationSize: 5,
                  sizePerPageList: [
                    {
                      text: "5",
                      value: 5,
                    },
                    {
                      text: "10",
                      value: 10,
                    },
                    {
                      text: "20",
                      value: 20,
                    },
                    {
                      text: "All",
                      value: data.length,
                    },
                  ],
                })}
                noDataIndication={"No Data"}
              />
            </>
          )}
        </ToolkitProvider>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </>
  );
}

export default TableList;
