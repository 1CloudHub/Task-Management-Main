import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Link, useNavigate } from "react-router-dom";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import APIService from "../Services/APIService";

function TableList({ columnss }) {
  const apiService = new APIService();
  const navigate = useNavigate();
  const columns = [
    {
      dataField: "id",
      text: "Task ID",
      classes: "tableColumn",
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          navigate("/TaskHistory");
        },
      },
      // <Link to={`/TaskHistory`}>{cellInfo.row.original.id}</Link>
    },
    {
      dataField: "category",
      text: "Category Name",
      classes: "tableColumn",
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          navigate("/TaskHistory");
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
  useEffect(() => {
    // apiService
    //   .request("dashboardTableData")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setData(data);
    //   })
    //   .catch((error) => {});
    fetch("data.json")
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setData(res.dashboardTableData);
      });
  }, []);
  return (
    <>
      <div className="container-fluid ">
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
