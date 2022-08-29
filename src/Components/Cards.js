import React from "react";
import { Card } from "react-bootstrap";
import { FaArrowRight, FaCircle } from "react-icons/fa";

function Cards({ item }) {
  return (
    <div>
      {" "}
      <Card className="p-2 card-bg backgroundCard rounded-0 m-1 cursor-pointer">
        <div className="row">
          {" "}
          <div className="w-90">
            <div>
              {" "}
              <b> {item.title}</b>
            </div>
            <div>
              {" "}
              {item.createdByName} <FaArrowRight /> {item.currentAssigneeName}{" "}
            </div>
            <div>
              {" "}
              <b> Created By : </b> {item.createdByName}
            </div>{" "}
            <div>
              {" "}
              <b> Due : </b> {item.dueDate && item.dueDate.formatString}{" "}
            </div>{" "}
          </div>
          <div className="w-10 d-flex align-items-center">
            <div>
              {item.statusName == "ASSIGNED" || "NEW" ? (
                <span className="assigned-status">
                  <FaCircle />
                </span>
              ) : item.statusName == "In Progress" ? (
                <span className="inprogress-status">
                  <FaCircle />
                </span>
              ) : item.statusName == "Closed" ? (
                <span className="resolved-status">
                  <FaCircle />
                </span>
              ) : item.statusName == "Due Date" ? (
                <span className="resolved-status">
                  <FaCircle />
                </span>
              ) : (
                ""
              )}
            </div>
          </div>{" "}
        </div>{" "}
      </Card>
    </div>
  );
}

export default Cards;
