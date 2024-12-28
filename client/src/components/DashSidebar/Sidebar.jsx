import React, { useEffect, useState } from "react";
import { Navbar, Sidebar } from "flowbite-react";
import { HiAnnotation, HiArrowSmRight, HiDocument, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutUserSuccess } from "../../store/user/userSlice";

function DashSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("");
  const dispatch=useDispatch();
  const {currentUser}=useSelector(state=>state.user);
  //USING THE NAVBAR  OF FLOWBITE ISOPEN AND SETISOPEN ARE EXTRA ADD ONS FROM MY SIDE TO MAKE THE SIDEBAR RESPONSIVE.
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignout=async()=>{
    try {
        console.log("Clicked signout");
        
        const response=await fetch("/api/u/signout",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        });
        const responseData=await response.json();
        console.log(responseData);
        
        if(!response.ok){
            console.log(responseData.msg);
            
        } else{
            dispatch(signoutUserSuccess());
        }
    } catch (error) {
        
    }
}

  return (
    <>
     {/* Navbar with Toggle for smaller screens */}
     <Navbar fluid={true} rounded={true} className="w-full  lg:w-64">
     <Navbar.Brand href="/" as={"div"}>
       <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white w-52 lg:w-60 truncate" title={currentUser.username}>
         Welcome, {currentUser.username}
       </span>
     </Navbar.Brand>
     <Navbar.Toggle onClick={toggleSidebar} />
   </Navbar>
   <div
        className={`fixed md:static top-0 left-0 h-full z-40 transition-transform duration-300 transform md:w-56 lg:w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
    <Sidebar  className="w-full">
      <Sidebar.Items>
        {/* Dashboard component */}
      {/* {currentUser.isAdmin && <NavLink to={"/dashboard?tab=users"}>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              active={tab === "users"}
              icon={HiOutlineUserGroup}
              labelColor="dark"
               as="div"
            >
             Users
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </NavLink>} */}

        {/*Profile Component  */}
        <NavLink to={"/dashboard?tab=profile"}>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={`${currentUser.isAdmin? currentUser.isSupreme?"SUPREME":"Admin":"User"}`}
              labelColor="dark"
               as="div"
            >
              Profile
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </NavLink>

        {/* Users component */}
        {currentUser.isAdmin && <NavLink to={"/dashboard?tab=users"}>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              active={tab === "users"}
              icon={HiOutlineUserGroup}
              labelColor="dark"
               as="div"
            >
             Users
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </NavLink>}

        {/* Posts component */}
        {currentUser.isAdmin && <NavLink to={"/dashboard?tab=posts"}>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              active={tab === "post"}
              icon={HiDocumentText}
              labelColor="dark"
               as="div"
            >
             Posts
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </NavLink>}

        {/* Comments Component */}
        {currentUser.isAdmin && <NavLink to={"/dashboard?tab=comments"}>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              active={tab === "comments"}
              icon={HiAnnotation}
              labelColor="dark"
               as="div"
            >
             Comments
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </NavLink>}

        <Sidebar.ItemGroup>
          <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </div>

    {/* Overlay for closing sidebar on small screens */}
    {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default DashSidebar;
