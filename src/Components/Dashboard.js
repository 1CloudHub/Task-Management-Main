import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import Footer from "./Footer";
import Graphs from "./Graphs/Graphs";
import AppNavBar from "./MIUI/AppNavBar";
import SideNavDrawer from "./MIUI/SideNavDrawer";
import NavBar from "./Nav-bar";
import TableList from "./TableList";
import { useQuery, gql } from "@apollo/client";
import CreatorTableList from "./Graphs/CreatorTableList";
import WatcherTableList from "./WatcherTableList";
const FILTERED_TASK_QUERY = gql`
  query GETALL($request: SearchRequest) {
    getFilteredTasks(request: $request) {
      title
      description
      status
      taskId
      categoryId
      createdBy
      currentAssignee
      dueDate {
        formatString(format: "MM-dd-yyyy")
      }
    }
  }
`;
function Dashboard({ logoutClick, userDetails }) {
  const tableResponse = useQuery(FILTERED_TASK_QUERY, {
    variables: {
      request: {
        page: 0,
        size: 10,
      },
    },
  });
  console.log("tableResponse : ", tableResponse);
  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      {/* <AppNavBar />
      <SideNavDrawer /> */}
      <br />
      <br />

      <div className="main-container">
        <div className="container-fluid">
          <div className="marginLeft5">
            <h5 className="themeColor"> Dashboard </h5>
          </div>
          <Tabs
            defaultActiveKey="handle"
            id="dashboard-nav-tab-id"
            className="mb-3 text-danger dashboard-tabs"
          >
            <Tab className="dashboard-tab" eventKey="handle" title="Handler">
              <Graphs />
              {tableResponse.data && <TableList response={tableResponse} />}
            </Tab>
            <Tab eventKey="watch" title="Watcher">
              <Graphs />
              <TableList columns={""} />
              <WatcherTableList />
            </Tab>
            <Tab eventKey="create" title="Creator">
              <Graphs />

              <CreatorTableList />
            </Tab>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
