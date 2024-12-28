
import { Button, Select, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard/PostCard';

function SearchPage() {
  const [sideBarData,setSideBarData]=useState({
    searchTerm:"",
    sort:"desc",
    category:"uncategorized",
  })
  const [posts,setPosts]=useState([]);
  const [loading,setLoading]=useState(false);
  const [showMore,setShowMore]=useState(false);
  const [errorfetching,setErrorFetching]=useState(null);
  const navigate=useNavigate();
  const location=useLocation();
  useEffect(() => {
   const urlParams=new URLSearchParams(location.search); //full url.
   const searchTermFromUrl=urlParams.get("searchTerm");
   const sortFromUrl=urlParams.get("sort");
   const categoryFromUrl=urlParams.get("category");

   if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
    setSideBarData({
      ...sideBarData,
      searchTerm:searchTermFromUrl,
      sort:sortFromUrl,
      category:categoryFromUrl
    });
   }

   const fetchPosts=async ()=>{
      setLoading(true);
      setErrorFetching(null);
      const searchQuery=urlParams.toString();
      console.log(searchQuery,"searchQuery"); //searchTerm=Hello2&sort=desc&category=react, "searchQuery"
      
      const response=await fetch(`/api/posts/getPosts?${searchQuery}`);
      const responseData=await response.json();
      if(!response.ok) {
        setLoading(false);
        setErrorFetching(responseData.msg);
        return;
      }

      setPosts(responseData.posts);
      setLoading(false);
      setErrorFetching(null);
      if(responseData.posts.length>=9) setShowMore(true);
      if(responseData.posts.length<9) setShowMore(false);
      console.log(posts);
      
   }
   fetchPosts();
  }, [location.search])
  
  console.log(sideBarData);
    
  const handleChange=(e)=>{
    if(e.target.name==="searchTerm"){
      // alert("a")
      setSideBarData({...sideBarData,searchTerm:e.target.value});
    }
    if(e.target.name==="sort"){
      // alert("b")

      const order=e.target.value || "desc";
      setSideBarData({...sideBarData,sort:order});
    }

    if(e.target.name==="category"){
      // alert("c")

      const category=e.target.value || "uncategorized";
      setSideBarData({...sideBarData,category});
    }

  }

  const handleSubmit=(e)=>{
      e.preventDefault();
      const urlParams=new URLSearchParams(location.search);
      if(sideBarData.searchTerm)
       urlParams.set("searchTerm",sideBarData.searchTerm);

      if(sideBarData.sort)
       urlParams.set("sort",sideBarData.sort);

    if(sideBarData.category)
       urlParams.set("category",sideBarData.category);
    
      const searchQuery=urlParams.toString();

      navigate(`/search?${searchQuery}`)
  } 

  const handleShowMore=async()=>{
    const numberofPosts=posts.length;
    const startIndex=numberofPosts;
    const urlParams=new URLSearchParams(location.search);
    urlParams.set("startIndex",startIndex);
    const searchQuery=urlParams.toString();

    const response=await fetch(`/api/posts/getPosts?${searchQuery}`);
      const responseData=await response.json();
      if(!response.ok) {
        setLoading(false);
        setErrorFetching(responseData.msg);
        return;
      }

      setPosts((prev)=>([...prev,...responseData.posts]));
      
      setLoading(false);
      setErrorFetching(null);
      if(responseData.posts.length>=9) setShowMore(true);
      if(responseData.posts.length<9) setShowMore(false);
      console.log(posts);

  }

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="p-7 border-b md:border-r border-gray-500">
        {/* <form className='flex md:flex-col flex-wrap gap-8 justify-center' > */}
        <form onSubmit={(e)=>handleSubmit(e)} className='flex md:flex-col gap-8 flex-wrap justify-center'>
          <div className="flex items-center gap-2 ">
            <label className='whitespace-nowrap font-semibold' htmlFor="searchTerm">Search Term:</label>
            <TextInput placeholder='search...' name='searchTerm'
              type='text'
              value={sideBarData.searchTerm}
              onChange={(e)=>handleChange(e)}
            />

          </div>

          <div className="flex items-center gap-2 md:justify-between">
            <label className='whitespace-nowrap font-semibold mr-14 md:mr-0' htmlFor="sort">Sort:</label>
            <Select name='sort' onChange={(e)=>handleChange(e)} value={sideBarData.sort} className='w-48'>
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
           </Select>
          </div>

          <div className="flex items-center gap-2 md:justify-between">
            <label className='whitespace-nowrap font-semibold mr-5 md:mr-0' htmlFor="category">Category:</label>
            <Select name='category' onChange={(e)=>handleChange(e)} value={sideBarData.category} className='w-48'>
            <option value="uncategorized">Uncategorized</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="javascript">JavaScript</option>
           </Select>

          </div>
          <Button type='submit' gradientDuoTone={"purpleToPink"}>Apply Filters</Button>
        </form>
      </div>
      
      <div className="w-full">
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results</h1>
        <div className="p-7 flex flex-wrap gap-4 justify-center items-center">
          {!loading && posts.length===0 && 
            <p className="font-extrabold dark:text-gray-400 text-gray-500 text-center text-3xl pt-7 mx-auto">
            No posts found.
          </p>
          }
          {loading && <div className='mx-auto w-[100%]      h-screen fixed bg-opacity-75 top-0 bottom-0 z-1000 text-center bg-black left-0 right-0 flex justify-center items-center overflow-hidden gap-4 font-bold text-xl flex-col'> <Spinner  size={"xl"}/>
          Please Wait....
          </div>
          }

          {!loading && posts && posts.map((post)=>(
            <PostCard key={post._id} post={post}/>
          ))}
          {
            showMore && <button onClick={(e)=>handleShowMore(e)} className='text-teal-500 border border-teal-500 h-fit p-1 py-2 rounded-md text-lg hover:bg-teal-400 hover:text-white w-[435px]'>Show More</button>
          }

        </div>
      </div>

    </div>
  )
}

export default SearchPage;