import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import APIService from "../../Services/APIService";

function PieChart({ getChartResponse }) {
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("-");
  };

  var re = getChartResponse.getFilteredTasks.reduce(function (pv, cv) {
    pv[cv.status] = pv[cv.status] === undefined ? 1 : (pv[cv.status] += 1);
    return pv;
  }, {});

  var ce = getChartResponse.getFilteredTasks.reduce(function (pv, cv) {
    const todayDate = formatDate(new Date());
    const responseDate = formatDate(
      cv.dueDate && new Date(cv.dueDate.formatString)
    );
    // console.log("todaYDate :: ", todayDate);
    // console.log("response Date  :: ", responseDate);
    // console.log("condiiton : ", todayDate > responseDate);

    if (todayDate > responseDate) {
      // console.log("count");
      pv[cv.status] = pv[cv.status] === undefined ? 1 : (pv[cv.status] += 1);
    }
    return pv;
  }, {});

  const getStatusNames = (JSON_Obj) => {
    var datajson = [];
    for (var key in JSON_Obj) {
      let status = "";
      switch (key) {
        case "0":
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

      var obj = {};
      if (status != "Closed") {
        obj["name"] = status;
        obj["value"] = JSON_Obj[key];

        datajson.push(obj);
      }
    }
    return datajson;
  };

  const withoutDueDate = getStatusNames(re);
  const withDueDate = getStatusNames(ce);
  // console.log("without Due Date : ", withoutDueDate);
  // console.log("withDueDate : ", withDueDate);

  // nwewly added

  const option = {
    tooltip: {
      trigger: "Task Status",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },

    series: [
      {
        name: "Status ",
        type: "pie",
        selectedMode: "single",
        radius: [0, "50%"],
        label: {
          position: "inner",
          fontSize: 11,
        },
        labelLine: {
          show: false,
        },
        data: withoutDueDate,
      },

      {
        name: "Past Due Date Status",
        type: "pie",
        radius: ["90%", "70%"],

        labelLine: {
          length: 10,
        },

        label: {
          formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
          backgroundColor: "#F6F8FC",
          borderColor: "#8C8D8E",
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: "#6E7056",
              lineHeight: 20,
              align: "center",
            },
            hr: {
              borderColor: "#8C8D8E",
              width: "100%",
              borderWidth: 1,
              height: 0,
            },
            b: {
              color: "#4C5058",
              fontSize: 11,
              fontWeight: "bold",
              lineHeight: 11,
            },
            per: {
              color: "#fff",
              backgroundColor: "#4C5058",
              padding: [3, 4],
              borderRadius: 0,
            },
          },
        },
        data: withDueDate,
      },
    ],
  };

  return (
    <div>
      {" "}
      <ReactEcharts style={{ height: "60vh" }} option={option} />
    </div>
  );
}

export default PieChart;
