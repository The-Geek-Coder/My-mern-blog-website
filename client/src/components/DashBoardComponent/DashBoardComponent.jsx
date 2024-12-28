import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import DashBoardComponentCard from '../DashBoardComponentCard/DashBoardComponentCard';
import { HiAnnotation, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import DashBoardComponentTables from '../DashBoardComponentTables/DashBoardComponentTables';

function DashBoardComponent() {
    const [usersData,setUsersData]=useState({
        users:[],
        totalNo:0
    });
    const [commentsData,setCommentsData]=useState({
        comments:[],
        totalNo:0
    });
    const [postsData,setPostsData]=useState({
        posts:[],
        totalNo:0
    });
    const [lastMonth,setLastMonth]=useState({
        users:0,
        posts:0,
        comments:0,
    })
    const {currentUser}=useSelector((state)=>state.user);

    useEffect(()=>{
        const fetchUsers=async()=>{
            const response=await fetch("/api/u/getUsers?limit=5");
            const responseData=await response.json();
            if(!response.ok){
                return;
            }

            setUsersData((prev)=>({...prev,totalNo:responseData.totalUser,users:responseData.users}));

            setLastMonth((prev)=>({...prev,users:responseData.lastMonthUsers}));

        }
        const fetchPosts=async()=>{
            const response=await fetch("/api/posts/getPosts?limit=5");
            const responseData=await response.json();
            if(!response.ok){
                return;
            }

            setPostsData((prev)=>({...prev,totalNo:responseData.totalPosts,posts:responseData.posts}));

            setLastMonth((prev)=>({...prev,posts:responseData.lastMonthsPostCount}));
        }

        const fetchComments=async()=>{
            // setLastMonth((prev)=>({...prev,comments:responseData.lastMonthComments}));
            const response=await fetch("/api/comments/getComments?limit=5");
            const responseData=await response.json();
            if(!response.ok){
                return;
            }

            setCommentsData((prev)=>({...prev,totalNo:responseData.totalComments,comments:responseData.comments}));

            setLastMonth((prev)=>({...prev,comments:responseData.lastMonthComments}));
        }

        if(currentUser.isSupreme){
            fetchComments();
            fetchPosts();
            fetchUsers();
        }
    },[currentUser])
    console.log(usersData.users.image,"hello");
    
  return (
    <div className="p-3 md:mx-auto">
        <div className="flex flex-wrap gap-4 justify-center">
       
       <DashBoardComponentCard total={usersData.totalNo} lastMonth={lastMonth.users} heading={"Total Users"}
            icon={<HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg'/>}
       /> 
       <DashBoardComponentCard total={postsData.totalNo} lastMonth={lastMonth.posts} heading={"Total Posts"}
         icon={<HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg'/>}
       /> 
       <DashBoardComponentCard total={commentsData.totalNo} lastMonth={lastMonth.comments} heading={"Total Comments"}
         icon={<HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg'/>}
       /> 
        </div>

    <div className="mt-5 flex flex-wrap py-3 mx-auto justify-center items-start gap-4">
    <DashBoardComponentTables content={usersData.users} dataType={"Users"}/>

<DashBoardComponentTables content={commentsData.comments} dataType={"Comments"}/>
<DashBoardComponentTables content={postsData.posts} dataType={"Posts"}/>
    </div>
    </div>
  )
}

export default DashBoardComponent;