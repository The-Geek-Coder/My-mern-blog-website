import { Alert, Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction/CallToAction';
import CommentSection from '../components/CommentSection/CommentSection';
import PostCard from '../components/PostCard/PostCard';

function SinglePost() {
  const {postSlug}=useParams();
  const [post,setPost]=useState(null);
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const [recentPosts,setRecentPosts]=useState(null);
  const [recentPostsError,setRecentPostsError]=useState(null);
  useEffect(()=>{
    const fetchPost=async ()=>{
     try {
      setLoading(true);
      const response=await fetch(`/api/posts/getPosts?slug=${postSlug}`);
      const responseData=await response.json();
      if(!response.ok){
        setError("Error fetching post");
        setLoading(false);
        return;
      }
      setPost(responseData.posts[0]);
      setError(null);
      setLoading(false);
      console.log(responseData.posts[0]);
      
     } catch (error) {
      
     }
    }
    fetchPost();
  },[postSlug]);
  
  useEffect(()=>{
      const fetchRecentPost=async ()=>{
        try {
        //  setLoading(true);
         const response=await fetch(`/api/posts/getPosts?limit=3`);
         const responseData=await response.json();
         if(!response.ok){
          setRecentPostsError(responseData.msg);
          // setLoading(false);
           return;
         }
         setRecentPosts(responseData.posts);
         setRecentPostsError(null);
        //  setLoading(false);
         console.log(responseData.posts[0]);
         
        } catch (error) {
          setRecentPostsError("Something Went wrong. Cannot fetch recent posts!");
        }
       }
       fetchRecentPost();
    },[]);

  return (
    <>
   {
    loading?(
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size="xl" />
    </div>
    ): 
    (
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl text-center mt-10 p-3 font-serif max-w-2xl mx-auto lg:text-4xl w-full overflow-x-hidden'>{post && post.title}</h1>
        <Button color="gray" pill size="xs" className="mx-auto"><NavLink to={`/search?category=${post &&post.category}`} className={"w-full h-full p-1 rounded-full border-transparent"}>{post && post.category}</NavLink></Button>
      <img className='mt-10 p-3 max-h-[600px] w-full rounded-md object-cover' src={post && post.image} alt={post && post.title} />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full  max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post && ((post.content.length)/1000).toFixed(0)} mins read</span>
      </div>
      <div className="p-3 max-w-2xl mx-auto w-full postContent" dangerouslySetInnerHTML={{__html:post && post.content}} >
        {/* dangerouslySetInnerHTML inbuilt property */}
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      {/* <CommentSection /> */}
      <CommentSection postOwnerId={post && post.userId} postId={post && post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className='text-xl mt-5'>Recent Articles</h1>
        <div className="flex flex-wrap items-center justify-center gap-5 mt-5 sm:w-[100vw]">
          {
           recentPostsError && !recentPosts && <Alert color={"failure"}>{recentPostsError}</Alert> 
          }
          {
            recentPosts && (
              recentPosts.map((rp)=><PostCard key={rp._id} post={rp} />)
            )
          }
        </div>
      </div>

      </main> 
    )
   }
   </>
  )
}

export default SinglePost;