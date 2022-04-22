import React, { useState } from "react";
import NavBar from "./Nav-bar";

function Home() {
  const [type, setType] = useState("Dashboard");
  const handleNavClick = (e) => {
    console.log("clicked", e.target.innerText);
    // let el = e.target.innerText;
    setType((prevState) => e.target.innerText);
    console.log("type", type);
  };

  return (
    <div>
      <NavBar
        clickFunction={handleNavClick}
        imageLogoLocation={"1cloudhub-small-logo.jfif"}
      />

      <div className="container-fluid pt-2">
        {/* {type == "View/Edit Task" && (
          <>
            {console.log("inside if", type)}
            <Managetask />
          </>
        )}

        {type === "Add Task" && <Newtask />}
        {type === "Task History" && <Taskhistory />}
        {type === "Dashboard" && <Dashboard />} */}
      </div>
    </div>
  );
}

export default Home;
