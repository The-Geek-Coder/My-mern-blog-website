import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CallToAction from '../components/CallToAction/CallToAction'
import PostCard from '../components/PostCard/PostCard';

function Home() {
  const [posts,setPosts]=useState([]);
  useEffect(()=>{
    const fetchPosts=async ()=>{
      try {
      //  setLoading(true);
       const response=await fetch(`/api/posts/getPosts?limit=9`);
       const responseData=await response.json();
       if(!response.ok){
        // setRecentPostsError(responseData.msg);
        // setLoading(false);
         return;
       }
       setPosts(responseData.posts);
      //  setRecentPostsError(null);
      //  setLoading(false);
       console.log(responseData.posts[0]);
       
      } catch (error) {
        // setRecentPostsError("Something Went wrong. Cannot fetch recent posts!");
        console.log(error.message);
        
      }
     }
     fetchPosts();
  },[]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="flex flex-col gap-6 lg:p-28 p-3 dark:bg-black bg-gray-200 rounded-md m-3 min-h-56 justify-center md:p-16">
        <h1 className='text-3xl font-bold lg:text-6xl md:text-4xl text-center sm:text-start'>Welcome To Swastik's Blog</h1>
        <p className='text-gray-500 text-sm sm:text-md xl:w-[70%] md:w-[90%] text-center sm:text-start'>
        Welcome to our blog for all coding enthusiasts! Here, you’ll find insightful articles and tutorials tailored for developers, engineers, and students. Explore new technologies and dive into discussions that elevate your coding journey. Join us to learn and unlock your potential today!
       </p>
        <NavLink to={"/search"} className={'text-md sm:text-lg text-teal-500 text-extrabold  border border-teal-500 rounded-lg w-fit py-3 px-4 hover:bg-teal-400 hover:text-gray-200 mx-auto sm:mx-0'}>See All Posts</NavLink>
      </div>

    <div className=" md:w-[80%]  bg-lime-100 dark:bg-zinc-800 mx-auto  my-6 md:rounded-full md:rounded-tr-md md:rounded-bl-md rounded-tl-3xl rounded-br-3xl"><CallToAction/></div>
    
    {/* <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7"> */}
    <div className="max-w-6xl  p-3 flex flex-col gap-8 py-7">
      {
        posts && 
        posts.length===0?  
        <>
        {/* <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
        <p className="font-extrabold dark:text-gray-400 text-gray-500 text-center text-3xl m-0 p-0">No Posts to show.</p> */}
        </>
        : (
          <div className="w-[100vw]">
            <div className="flex justify-center gap-5 items-center lg:relative">
            <h2 className='text-2xl lg:text-3xl font-semibold text-center'>Recent Posts</h2>
            
            <NavLink to={"/search"} className={'text-sm text-teal-500 text-normal   border-2 border-teal-500 rounded-lg w-fit p-3 sm:px-5 hover:bg-teal-400 hover:text-gray-200 mx-auto sm:mx-0 text-center lg:absolute lg:right-24'}>See All Posts</NavLink>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-5 sm:w-[100vw]">
            {posts.map((post)=>(
              <PostCard key={post._id} post={post}/>
            ))}
            </div>
          </div>
        )
      }
    </div>

    </div>
  )
}

export default Home