import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";

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
}) {
  return (
    <div>
      <div className="filters-sorting ">
        <div className="text-end ">
          <span
            className="filter-icons cursor-pointer"
            onClick={handleEyeIconClick}
          >
            <FaFilter />
          </span>
          <span className="filter-icons cursor-pointer" onClick={handleSorter}>
            <FaSortAmountDown />
          </span>
        </div>
      </div>
      <div className="show-web">
        <div className="row ">
          <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <FaFilter />
                </Accordion.Header>
                <Accordion.Body>
                  <form onSubmit={submitFilter}>
                    <div className="row">
                      <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
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
                              onChange={handleStart}
                            />
                            <BsCalendar className="mt-1" />
                          </div>
                        </label>
                      </div>
                      <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
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
                              onChange={handleEnd}
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
                      <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div className="text-center pt-3">
                          <button
                            type="button"
                            className="btn btn-clr rounded-0 filter-btn-submit"
                          >
                            submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-1 col-lg-1 ">
            <div className="btn d-flex justify-content-center  card p-1">
              <span onClick={handleSorter}>
                <FaSortAmountDown />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
