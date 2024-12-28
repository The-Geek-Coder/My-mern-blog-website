import { Alert, Button, Modal, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function formatDateToDDMMYYYY(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  //The 2 in padStart(2, '0') specifies that the final length of the string should be 2 characters, and '0' is the padding character used to achieve that length.
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore,setShowMore]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [userDeleteError,setUserDeleteError]=useState(null);
  const [userDeleteConsentInp,setUserDeleteConsentInp]=useState(null);
  const [userIdToDelete,setUserIdToDelete]=useState(null);
  const [userNameToDelete,setUserNameToDelete]=useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setShowMore(true);
        const response = await fetch(
          `/api/u/getUsers`
        );
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) return;

        setUsers(responseData.users);
        if(responseData.users.length<9) setShowMore(false);
        console.log(users, "Hello there guys");
      } catch (error) {
        console.log(error.message);
        
      }
    };
    if(users.length===0) {
        setShowMore(false);
    }
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id]);

  const handleShowMore=async ()=>{
    const startIndex=users.length;
    try {
        const response = await fetch(
            `/api/u/getUsers?startIndex=${startIndex}`
          );
          const responseData = await response.json();
          console.log(responseData);
          if (!response.ok) return;
          if(responseData.users.length<9) setShowMore(false);
          console.log(users, "Hello there guys");
          setUsers((prev)=>[...prev,...responseData.users]);
    } catch (error) {
        console.log(error.message);
    }
  }

  const handleDeleteuser=async(e)=>{
    e.preventDefault();
//    alert(userIdToDelete);
   try {
    console.log(userDeleteConsentInp);
    const response=await fetch(`/api/u/delete/${userIdToDelete}`,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({deleteUserConsent:userDeleteConsentInp})
    });
    const responseData=await response.json();
    if(!response.ok) {
        setUserDeleteError(responseData.msg);
        return;
    }
    setUsers((prev)=>prev.filter((user)=>user._id!==userIdToDelete));
    setShowModal(false);
    userDeleteConsentInp("");
   } catch (error) {
    
   }
  }

  return (
    <>
      <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar-track-slate-700 scrollbar-thumb-slate-500 md:w-[70vw]">
        {currentUser.isAdmin && users.length > 0 ? (
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>
                Date Joined <div className="mt-1">(dd/mm/yyyy)</div>
              </Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              {/* <Table.HeadCell>edit</Table.HeadCell> */}
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {formatDateToDDMMYYYY(user.updatedAt)}
                  </Table.Cell>

                  <NavLink to={`/user/${(!user.isSupreme && user._id!==currentUser._id)?user.username:currentUser.username}`}>
                    <Table.Cell>
                      <img
                        className="h-10 w-20 object-cover bg-gray-500"
                        src={user.image}
                        alt={user.title}
                      />
                    </Table.Cell>
                  </NavLink>

                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {
                     (currentUser._id!==user._id)?
                     (!user.isSupreme?user.username:"SUPREME")
                    :(user.isSupreme?"YOU (supreme)":`(YOU) ${user.username} `)
                  }
                  </Table.Cell>

                  <Table.Cell>{user.isAdmin?<FaCheck className="text-green-500" />:<FaTimes className="text-red-600" />}</Table.Cell>

                  <Table.Cell>{(!user.isAdmin || !user.isSupreme) && <span>{user.email}</span>}</Table.Cell>

                  <Table.Cell>
                    {
                    !user.isSupreme &&
                        <button disabled={currentUser._id===user._id} onClick={()=>{
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                        setUserNameToDelete(user.username);
                    }} className={`cursor-pointer hover:underline ${currentUser._id===user._id?"text-red-800":"text-red-600"}`}>Delete</button>
                    }
                  </Table.Cell>

                  {/* <NavLink className={"text-teal-500 hover:underline hover:cursor-pointer"} to={`/updateuser/${user._id}`}>
                    <Table.Cell>
                      <span>Edit</span>
                    </Table.Cell>
                  </NavLink> */}

                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        ) : (
          <p className="font-extrabold dark:text-gray-400 text-gray-500 text-center text-3xl pt-7">No users showed up.</p>
        )}
        {showMore &&
            <button onClick={handleShowMore} className="w-full text-teal-500 text-center self-center text-sm py-4 m-1 dark:bg-gray-700 bg-slate-100 rounded-lg">Show More</button>
        }
        
      </div>

       <Modal show={showModal} onClose={()=>{
            setUserDeleteError(null);
            setShowModal(false)
            }} popup size={"md"}>
            <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-md text-gray-500 dark:text-gray-400'>To delete this user type: <span className='font-bold text-red-600 rounded-md block'>"I WanT To DeLeTe the aCcoUnT Of {userNameToDelete}"</span> as a form of consent</h3>
                </div>
                <form>
                {userDeleteError && <Alert color={"failure"} className='mx-auto my-2 w-[100%]'>{userDeleteError}</Alert>}
                <TextInput value={userDeleteConsentInp} required onChange={(e)=>{
                    setUserDeleteConsentInp(e.target.value);
                }} placeholder='Give consent'/>
                <p className="text-sm text-gray-500 font-bold mt-2">Note: All data will be permanently lost upon deletion</p>
                <div className="flex justify-between mt-5">
                    <Button type='submit' color={"failure"} onClick={handleDeleteuser}>Yes I am sure</Button>
                    <Button color={"success"} onClick={()=>{
                        setShowModal(false);
                        setUserDeleteError(null);
                    }
                    }>No, Cancel</Button>
                </div>
                </form>
            </Modal.Body>

        </Modal>
    </>
  );
}

export default DashUsers;
