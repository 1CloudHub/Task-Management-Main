import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import ReactDatePicker from "react-datepicker";
import { AiFillEdit, AiOutlineHistory } from "react-icons/ai";
import { BsCalendar } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import APIService from "../Services/APIService";

function TableList({ response }) {
  console.log("response", response);
  const apiService = new APIService();
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  let key = 0;
  const columns = [
    {
      dataField: "taskId",
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
      dataField: "categoryId",
      text: "Category Name",
      classes: "tableColumn",
      events: {
        onClick: (e, column, columnIndex, row) => {
          navigate(`/ManageTask/${row.id}`);
        },
      },
    },

    {
      dataField: "createdBy",
      text: "Created By",
    },
    {
      dataField: "currentAssignee",
      text: "Assigned To",
    },
    {
      text: "Assign",
      formatter: (cellContent, row) => {
        return (
          <>
            <span className="assignbutton">Self</span>&nbsp;
            <span className="assignbutton">Member</span>&nbsp;
          </>
        );
      },
    },
    {
      text: "Actions",
      formatter: (cellContent, row) => {
        return (
          <>
            <Link to="/TaskHistory">
              <span title="view history" className="assignbutton">
                <AiOutlineHistory />
              </span>
            </Link>
          </>
        );
      },
    },
  ];
  const { SearchBar, ClearSearchButton } = Search;

  const [data, setData] = useState([
    {
      id: 1,
      category: "Interest",
      subCatagory: "Personal",
      subSubCatagory: "Male",
      subject: "Loan Type",
      taskStatus: "In Progress",
      createdOn: "24 Jan 2021",
      createdBy: "Ram",
      assignedTo: "Paul",
    },
    {
      id: 2,
      category: "Home",
      subCatagory: "Personal",
      subSubCatagory: "Female",
      subject: "Loan Type",
      taskStatus: "In Progress",
      createdOn: "24 Jan 2021",
      createdBy: "Ram",
      assignedTo: "Paul",
    },
    {
      id: 3,
      category: "Money",
      subCatagory: "Home",
      subSubCatagory: "Male",
      subject: "Loan Type",
      taskStatus: "Completed",
      createdOn: "2 Feb 2021",
      createdBy: "John",
      assignedTo: "Richie",
    },
    {
      id: 4,
      category: "CAR",
      subCatagory: "Appliances",
      subSubCatagory: "Male",
      subject: "Car Loan Type",
      taskStatus: "Completed",
      createdOn: "2 Feb 2021",
      createdBy: "Suresh",
      assignedTo: "Oliver",
    },
    {
      id: 5,
      category: "Bike",
      subCatagory: "Appliances",
      subSubCatagory: "Female",
      subject: "Bike Loan Type",
      taskStatus: "Completed",
      createdOn: "2 mar 2021",
      createdBy: "Drake",
      assignedTo: "Oliver",
    },
    {
      id: 6,
      category: "Apartment",
      subCatagory: "Home",
      subSubCatagory: "Female",
      subject: "Home Loan ",
      taskStatus: "Completed",
      createdOn: "2 mar 2021",
      createdBy: "Drake",
      assignedTo: "Oliver",
    },
  ]);
  const [taskStatus, setTaskStatus] = useState([]);

  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
    key = selectedValue.target.value;

    setData((prevState) => ({ ...prevState, category: key }));
  };

  return (
    <>
      <div className="container-fluid ">
        <div className="container"></div>
        <br />
        {response && (
          <ToolkitProvider
            keyField="id"
            data={response.data.getFilteredTasks}
            columns={columns}
            search
          >
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
                    <div className="clear-button">
                      <ClearSearchButton
                        className="btn btn-clr rounded-0 text-small font-size-small"
                        {...props.searchProps}
                      />
                    </div>
                  </div>
                </div>
                <BootstrapTable
                  keyField="id"
                  striped={false}
                  bordered={false}
                  condensed={true}
                  hover={true}
                  classes="mobile-responsive table-responsive "
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
        )}
        <br />
        <br />
        {/* <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br /> */}
      </div>
    </>
  );
}

export default TableList;
