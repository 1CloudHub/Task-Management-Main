import React from "react";
import { Card } from "react-bootstrap";
import { FaCircle } from "react-icons/fa";
import ReactDatePicker from "react-datepicker";
import { IoMdArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Cards from "./Cards";

function CardList({ response }) {
  let leftBox = response && response.data.getFilteredTasks;

  let half = Math.ceil(leftBox.length / 2);
  let firstHalf = leftBox.slice(0, half);

  let secondHalf = leftBox.slice(-half);

  return (
    <div>
      <div>
        <div className="row mt-1">
          {firstHalf.map((item, index) => {
            return (
              <>
                {/* {index} */}
                <div className="col-lg-6">
                  <Link to={`/ManageTask/` + item.taskId}>
                    <Cards key={index} item={item} />
                  </Link>
                </div>
              </>
            );
          })}
          {secondHalf.map((item, index) => {
            return (
              <>
                <div className="col-lg-6">
                  <Link to={`/ManageTask/` + item.taskId}>
                    <Cards key={index} item={item} />
                  </Link>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CardList;
