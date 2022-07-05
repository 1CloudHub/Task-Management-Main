import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import APIService from "../../Services/APIService";
function BarGraph() {
  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const apiService = new APIService();
  useEffect(() => {
    apiService
      .request("bargraph-x")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        setXData(myJson);
      })
      .catch((error) => {
        console.log(error);
      });
    apiService
      .request("bargraph-y")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        setYData(myJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const option = {
    xAxis: {
      type: "category",
      data: xData,
    },
    yAxis: {
      type: "value",
    },
    color: ["#fac858"],
    series: [
      {
        data: yData,
        type: "bar",
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
