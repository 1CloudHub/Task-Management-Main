import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import APIService from "../../Services/APIService";
function BarGraph() {
  const status = {
    getFilteredTasks: [
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
      {
        status: 0,
      },
    ],
  };

  // let output = array1.reduce(
  //   (previousValue, currentValue) => previousValue + currentValue,
  //   initialValue
  // );

  const option = {
    xAxis: {
      type: "category",
      data: [
        "Initiated",
        "New",
        "In Progress",
        "Reassigned",
        "Resolved",
        "Closed",
        "Reopened",
      ],
      axisLabel: {
        interval: 0,
        rotate: 50, //If the label names are too long you can manage this by rotating the label.
      },
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
    },

    series: [
      {
        type: "bar",
        data: [, 0, 9.0, 26.4, 28.7, 70.7, 48.7],
      },
    ],
  };
  return (
    <div>
      <ReactEcharts option={option} />
    </div>
  );
}

export default BarGraph;
