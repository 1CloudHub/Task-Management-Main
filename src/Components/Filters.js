import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
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
  tabType,
  defSortType,
}) {
  return (
    <div>
      <div className="filters-sorting ">
        {/* <div className="text-end ">
          <span
            className="filter-icons cursor-pointer"
            onClick={handleEyeIconClick}
          >
            <FaFilter />
          </span>
          <span className="filter-icons cursor-pointer" onClick={handleSorter}>
            <FaSortAmountDown />
          </span>
        </div> */}
      </div>
      <div className="d-flex">
        {/* <div className="row"> */}
        <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11 width85">
          <div className="accordion-item rounded-0">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <FaFilter />
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse "
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
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
                          className="btn btn-clr rounded-0 "
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <FaFilter />
                </Accordion.Header>
                <Accordion.Body>
                  <form name={tabType} onSubmit={submitFilter}>
                    <div className="row">
                      <div className=" col-xs-3 col-sm-12 col-md-3 col-lg-11">
                        <label className=" w-100 ">
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
                      <div className=" col-xs-3 col-sm-12 col-md-3 col-lg-3">
                        <label className="w-100 ">
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
                      <div className=" col-xs-3 col-sm-12 col-md-3 col-lg-3">
                        <label>
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
                      <div className=" col-xs-3 col-sm-12 col-md-3 col-lg-3">
                        <div className="text-center pt-3">
                          <button
                            type="submit"
                            name={tabType}
                            value={tabType}
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
            </Accordion> */}
          </div>
        </div>
        &nbsp;{" "}
        <div
          className="col-xs-6 col-sm-10 col-md-1 col-lg-1 ml-2 width15"
          onClick={handleSorter}
        >
          <div className="btn d-flex justify-content-center card rounded-0">
            {defSortType ? (
              <span title="desc sort">
                <FaSortAmountDown />
              </span>
            ) : (
              <span title="asc sort">
                <FaSortAmountUp />
              </span>
            )}
          </div>
        </div>
        {/* </div> */}
      </div>
      {/* <div className="">
        <div className="row ">
          <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <FaFilter />
                </Accordion.Header>
                <Accordion.Body>
                  <form name={tabType} onSubmit={submitFilter}>
                    <div className="row">
                      <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <label className=" w-100 ">
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
                        <label className="w-100 ">
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
                      <div className=" col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div className="text-center pt-3">
                          <button
                            type="submit"
                            name={tabType}
                            value={tabType}
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
      </div> */}
    </div>
  );
}

export default Filters;
