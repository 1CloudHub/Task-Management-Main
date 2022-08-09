import React, { useState } from "react";
import { Accordion, Collapse } from "react-bootstrap";
import { FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { Button } from "react-bootstrap";

function Filters({
  handleEyeIconClick,
  handleSorter,
  categoryResponse,
  submitFilter,
  startDate,
  endDate,
  handleStart,
  handleCategoryChange,
  handleEnd,
  tabType,
  defSortType,
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="d-flex justify-content-end">
        <div className="">
          <Button
            className="btn btn-clr border-0 rounded-0"
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            <FaFilter />
          </Button>
        </div>
        &nbsp;
        <div
          className=" d-flex justify-content-center  "
          onClick={handleSorter}
        >
          {defSortType ? (
            <span className="btn btn-clr border-0 rounded-0" title="desc sort">
              <FaSortAmountDown />
            </span>
          ) : (
            <span className="btn btn-clr border-0 rounded-0" title="asc sort">
              <FaSortAmountUp />
            </span>
          )}
        </div>
      </div>
      <div className="mt-1">
        <Collapse className="card border rounded-0 p-4 shadow" in={open}>
          <div id="example-collapse-text">
            <h6>Filter</h6>
            <form name={tabType} onSubmit={submitFilter}>
              <div className="row">
                <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                  <label className=" w-100 mt-2">
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
                        onChange={handleStart}
                      />
                      <BsCalendar className="mt-1" />
                    </div>
                  </label>
                </div>
                <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                  <label className="w-100 mt-2">
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
                        onChange={handleEnd}
                      />
                      <BsCalendar className="mt-1" />
                    </div>
                  </label>
                </div>
                <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                  <label className="w-100 mt-2">
                    <span className="filter-span-header">Category</span>{" "}
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
                  </label>
                </div>
                <div className=" col-xs-3 col-sm-4 col-md-2 col-lg-2">
                  <div className="text-center pt-3 mt-2">
                    <button
                      type="submit"
                      name={tabType}
                      value={tabType}
                      className="btn btn-clr rounded-0 filter-btn-submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

export default Filters;
