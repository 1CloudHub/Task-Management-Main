import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import Footer from "./Footer";
import Graphs from "./Graphs/Graphs";
import NavBar from "./Nav-bar";
import TableList from "./TableList";
function Dashboard({ logoutClick, userDetails }) {
  return (
    <div>
      <NavBar logoutClick={logoutClick} userDetails={userDetails} />
      <br />
      <div className="main-container">
        <div className="container-fluid">
          <div className="marginLeft5">
            <h5 className="themeColor"> Dashboard </h5>
          </div>
          <Tabs
            defaultActiveKey="graph"
            id="dashboard-nav-tab-id"
            className="mb-3 text-danger dashboard-tabs"
          >
            <Tab className="dashboard-tab" eventKey="graph" title="Graph">
              <Graphs />
            </Tab>
            <Tab eventKey="list" title="List">
              <TableList columns={""} />
            </Tab>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
