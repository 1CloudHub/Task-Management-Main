import React from "react";
import { FaCircle } from "react-icons/fa";

function Taskhistory({ item, index }) {
  return (
    <div>
      <div key={index} className="mt-2">
        <div className="d-flex">
          <div className="d-block">
            <div>
              {" "}
              {item.statusName == "ASSIGNED" ? (
                <FaCircle className="assigned-status " />
              ) : item.statusName == "COMPLETED" ? (
                <FaCircle className="dueDate-status" />
              ) : item.statusName == "IN_PROGRESS" ? (
                <FaCircle className="inprogress-status" />
              ) : (
                ""
              )}{" "}
            </div>
            <div className="vl ms-1"> </div>
          </div>

          <div className="ms-3">
            <div>
              <span>From:</span> {item.fromName}{" "}
            </div>
            <div>
              <span>To:</span> {item.toName}{" "}
            </div>
            <div>
              <span>Start Date: </span> {item.start_date.formatString}{" "}
            </div>
            <div>
              <span>Status:</span> {item.statusName}{" "}
            </div>
            <div>
              <span>Day since Previous Inception:</span>{" "}
              {item.DaysSincePrevious}
            </div>
            <div>
              <span>Day since Inception:</span> {item.DaysSinceInception}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Taskhistory;
