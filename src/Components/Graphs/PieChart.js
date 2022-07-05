import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import APIService from "../../Services/APIService";

function PieChart() {
  const [data, setData] = useState([]);
  const apiService = new APIService();
  useEffect(() => {
    apiService
      .request("piechart")
      .then((response) => {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
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
