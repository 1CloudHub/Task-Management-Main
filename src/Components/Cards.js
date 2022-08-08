import React from "react";
import { Card } from "react-bootstrap";
import { FaArrowRight, FaCircle } from "react-icons/fa";

function Cards({ item }) {
  return (
    <div>
      {" "}
      <Card className="p-2 card-bg backgroundCard rounded-0 m-1 cursor-pointer">
        <div className="d-flex">
          {" "}
          <div className="w-75 ml-2">
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
              <b> Due : </b> {item.dueDate && item.dueDate.formatString}{" "}
            </div>{" "}
          </div>
          <div className="floatRight mt-4">
            <div>
              {item.statusName}{" "}
              {item.statusName == "Due Past" ? (
                <FaCircle className="MyTaskStatusCircleDuePast" />
              ) : item.statusName == "InProgress" ? (
                <FaCircle className="MyTaskStatusCircleInprogress" />
              ) : item.statusName == "New" ? (
                <FaCircle className="MyTaskStatusCircleNew" />
              ) : (
                ""
              )}{" "}
            </div>
          </div>{" "}
        </div>{" "}
      </Card>
    </div>
  );
}

export default Cards;
