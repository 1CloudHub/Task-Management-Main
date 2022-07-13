import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import APIService from "../../Services/APIService";

function PieChart({ getChartResponse }) {
  console.log(getChartResponse);

  var re = getChartResponse.getFilteredTasks.reduce(function (pv, cv) {
    pv[cv.status] = pv[cv.status] === undefined ? 1 : (pv[cv.status] += 1);
    console.log(JSON.stringify(pv));
    return pv;
  }, {});

  // nwewly added
  var JSON_Obj = re;
  for (var key in JSON_Obj) {
    // console.log("key in for :", key);
  }
  var datajson = [];
  var newJSON_Obj = "[";
  for (var key in JSON_Obj) {
    console.log("key", key);
    let status = "";
    switch (key) {
      case "0":
        console.log("inside first iff");
        status = "Initiated";
        break;
      case "1":
        status = "New";
        break;
      case "2":
        status = "In Progress";
        break;
      case "3":
        status = "Reassigned";
        break;
      case "4":
        status = "Resolved";
        break;
      case "5":
        status = "Closed";
        break;
      case "6":
        status = "Reopened";
        break;
    }
    // console.log(status);
    if (newJSON_Obj.length > 2) newJSON_Obj += ",";
    newJSON_Obj += '{"name":"' + status + '","value":' + JSON_Obj[key] + "}";
    var obj = {};
    obj["name"] = status;
    obj["value"] = JSON_Obj[key];
    datajson.push(obj);
  }
  newJSON_Obj += "]";

  let d = JSON.stringify(newJSON_Obj);
  console.log(d);

  const option = {
    title: {
      text: "",
      subtext: "",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "right",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: datajson,
      },
    ],
  };
  return (
    <div>
      {" "}
      <ReactEcharts option={option} />
    </div>
  );
}

export default PieChart;
