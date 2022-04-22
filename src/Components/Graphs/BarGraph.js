import React from "react";
import ReactEcharts from "echarts-for-react";
function BarGraph() {
  const option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
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
