import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashSidebar from "../components/DashSidebar/sidebar";
import DashProfile from "../components/DashProfile/profile";
import DashPost from "../components/DashPost/DashPost";
import DashUsers from "../components/DashUsers/DashUsers";
import DashComments from "../components/DashComments/DashComments";
import { useSelector } from "react-redux";
import DashBoardComponent from "../components/DashBoardComponent/DashBoardComponent";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const {currentUser}=useSelector(state=>state.user);
  const navigate=useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");

    if(tabFromURL){
      setTab(tabFromURL);
    }
    console.log(tabFromURL);
    /* EXPLANATION OF ABOVE CODE. 
  // Using useLocation to get the full URL
    const location = useLocation();
    console.log(location.search); // Output: ?key=value&anotherKey=anotherValue
  // Using URLSearchParams to parse query strings
     const queryParams = new URLSearchParams(location.search);
     console.log(queryParams.get('key')); // Output: value
  `` console.log(queryParams.get('anotherKey')); // Output: anotherValue
 */
  }, [location.search]); //render on change of location search change.

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* sidebar */}
        <div className="md:w-56 lg:w-64">
          <DashSidebar />
        </div>

        {/*right side content  */}
        <div className="w-full">
          {
            (currentUser?.isAdmin  || tab==="profile")?
            <>  
          {tab==="profile" && <DashProfile />}
          {tab==="posts" && <DashPost/>}
          {tab==="users" && <DashUsers/>}
          {tab==="comments" && <DashComments/>}

          {tab==="analytics" && (currentUser.isSupreme ? <DashBoardComponent/>:navigate("/signin"))}

          </>
          :navigate("/signin")
        }
        </div>
      </div>
    </>
  );
}

export default Dashboard;
