import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import ReactDatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import APIService from "../../Services/APIService";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";
import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";

const CATEGORY_QUERY = gql`
  {
    getCategories {
      categoryId
      name
      createdBy
    }
  }
`;

const GET_DASHBOARD_QUERY = gql`
  query GETFILTERED_QUERY($request: SearchRequest) {
    getFilteredTasks(request: $request) {
      status
    }
  }
`;

function Graphs({ response }) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [taskStatus, setTaskStatus] = useState([]);
  const currentWeek = () => {
    let d = new Date(new Date());
    // var day = d.getDay(),
    //   diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    // let weekofDay = new Date(d.setDate(diff));
    const lastWeekDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate() - 7
    );
    // console.log(lastWeekDate);
    return lastWeekDate;
  };
  const categoryResponse = useQuery(CATEGORY_QUERY);
  const getChartResponse = useQuery(GET_DASHBOARD_QUERY, {
    variables: {
      request: {
        page: 1,
        size: 10,
      },
    },
  });

  useEffect(() => {
    // console.log(currentWeek());
    setStartDate(currentWeek);
  }, []);

  const handleCategoryChange = (selectedValue) => {
    console.log(selectedValue.target.value);
  };

  return (
    <div className="">
      <div className="row ">
        <div className="col-xs-2 col-sm-2 col-lg-2 col-md-2"></div>

        <div className="col-xs-8 col-sm-8 col-lg-8 col-md-8">
          {response && <PieChart getChartResponse={response.data} />}
          <br />
          <br />
          <br />
          <br />
        </div>

        <div className="col-xs-2 col-sm-2 col-lg-2 col-md-2"></div>
      </div>
    </div>
  );
}

export default Graphs;
