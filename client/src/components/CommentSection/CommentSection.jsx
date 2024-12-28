import { Alert, Button, Modal, Spinner, Textarea, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import CommentComponent from '../CommentComponent/CommentComponent';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function CommentSection({postId,postOwnerId}) {
    const {currentUser}=useSelector((state)=>state.user);
    console.log(currentUser);
    const [comment,setComment]=useState("");
    const [commentError,setCommentError]=useState(null);
    const [commentFetchError,setCommentFetchError]=useState(null);
    const [comments,setComments]=useState([]);
    const [loading,setLoading]=useState(false);
    const [likingWithoutSigningUp,setLikingWithoutSigningUp]=useState(()=>false);
    const [showModal,setShowModal]=useState(false);
    const [commentToDelete,setCommentToDelete]=useState(null);
    const [commentToDeleteError,setCommentToDeleteError]=useState(null);
    const navigate=useNavigate();
    useEffect(()=>{
        const getComments=async()=>{
           try {
            const response=await fetch(`/api/comments/getPostComment/${postId}`);
            const responseData=await response.json();
            if(!response.ok){
                setCommentFetchError("Error loading comments");
                console.log("gello");
                
                return;
            }
            setComments(responseData.comments);
           } catch (error) {
                setCommentFetchError("Error loading comments");
           }

        }
        getComments();
    },[postId]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(comment.length<=0 || comment.length>200){
            console.log("comment length not proper");
            setCommentError("Comment length not within the limits")
            return;
        }
       try {
        setCommentError(null);
        setLoading(true);
        const response=await fetch(`/api/comments/create`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({postId,userId:currentUser._id,content:comment})
        });
        const responseData=await response.json();
        if(!response.ok){
            // alert("entered")
            setCommentError(responseData.msg);
            setLoading(false);
            console.log("response not ok");
            return;
        }
        setComment("");
        setLoading(false);
        setCommentError(null);
        console.log(responseData);
        
        setComments((prev)=>[responseData.newComment,...prev]);
       } catch (error) {
        setCommentError("Something went wrong! try again");
        setLoading(false);
       }
    }

    const handleLike=async (commentId)=>{
        try {
            console.log(commentId,"cid");
            
            if(!currentUser) {
                setLikingWithoutSigningUp(true);
                return;
            }
            const response=await fetch(`/api/comments/likeComment/${commentId}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            const responseData=await response.json();
            setComments((prev)=>{
               return prev.map((c)=>{
                    if(c._id===commentId){
                       return {
                        ...c,
                        likes:responseData.comment.likes,
                        numberOfLikes:responseData.comment.numberOfLikes
                       }
                    }
                    else{
                        return c;
                    }
                })
            })
        } catch (error) {
            
        }
    }

    const handleCommentEdit=(comment,editedContent)=>{
        setComments((prev)=>prev.map((c)=>
            c._id===comment._id?{...c,content:editedContent}:c
        ))
    }

 const handleCommentDelete=async(commentId)=>{
    setCommentToDeleteError(null);
    setShowModal(true);
    setCommentToDelete(commentId);
 }

 const handlePermanentCommentDelete=async(e,commentId)=>{
    e.preventDefault();
    try {
        setCommentToDeleteError(null);
        setLoading(true);
        if(!currentUser){
            navigate("/signin");
            return;
        }
        if(!commentId) { 
            setCommentToDeleteError("Cannot delete the comment");
            return;
        }

        const response=await fetch(`/api/comments/deleteComment/${commentId}`,{
            method:"DELETE"
        })
        const responseData=await response.json();
        if(!response.ok){
            setCommentToDeleteError(responseData.msg);
            setLoading(false);
            return;
        }
        setComments((prev)=>(
            prev.filter((c)=>(
                commentToDelete!==c._id
            ))
        ));
        setCommentToDeleteError(null);
        setLoading(false);
        setShowModal(false);
    } catch (error) {
        setCommentToDeleteError("Something went wrong, Cannot delete this comment!");
        setLoading(false);
    }
 }

  return (
   <>
   <div className='max-w-2xl mx-auto w-full p-3'>
    {currentUser?
        (<div className="flex flex-col sm:flex-row items-center gap-1 my-5 text-gray-500 text-sm">
                <p>Signed in as:</p>
                <img className='h-5 w-5 object-cover rounded-full bg-gray-500' src={currentUser.userProfileImageUrl} alt="profile image" />
                <NavLink   className={"text-sm text-cyan-600 hover:underline"} to={"/dashboard/?tab=profile"}>@{currentUser.email}</NavLink>
            </div>
        ):(<div className='text-sm text-teal-500 my-5 gap-1  flex'>
            You must be signed in to comment.  
            <NavLink to={"/signin"} className={"text-blue-500 hover:underline"}>Sign in</NavLink>
        </div>)
    }
    {likingWithoutSigningUp && (
        <Modal show={likingWithoutSigningUp} onClose={()=>setLikingWithoutSigningUp(false)} popup size={"md"}>
            <Modal.Header />
            <Modal.Body>
               <div className="flex flex-col items-center justify-center">
                <div className="text-4xl m-2">"😊"</div>
               <h3 className='text-xl mb-4'>Sign in to like the posts</h3>
            <div className="w-full">
                <NavLink to="/signin">
             <Button gradientDuoTone={"purpleToBlue"} className='mx-auto w-full'>Sign in Now</Button>
             </NavLink>
            </div>
               </div>
            </Modal.Body>
        </Modal>
    )}
    {
        currentUser && 
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
            <Textarea
                placeholder='Add a comment...'
                rows={3}
                maxLength={"200"}
                className='min-h-[100px] max-h-[200px]'
                onChange={(e)=>setComment(e.target.value)}
                value={comment}
            />
            <div className="flex gap-1 items-center justify-between mt-5">
                <p className={`text-sm px-1 flex-1 text-center ${comment.length===200?"text-yellow-300":"text-gray-500"}`}>{200-comment.length} characters remaining</p>
                <Button disabled={((comment.length<=0 || comment.length>200) || loading)} className={`flex-1 ${()=>((comment.length<=0 || comment.length>200) || loading)?"cursor-not-allowed":"cursor-pointer"}`} gradientDuoTone={"purpleToBlue"} type='submit'>{loading?
                <>
               <Spinner size='sm'/>
                <span className="pl-3">Submitting...</span>
               </>:"Submit"}</Button>
            </div>
            {commentError && <Alert className='mt-5' color={"failure"}>{commentError}</Alert>}
        </form>
    }
    {commentFetchError ?<Alert color={"failure"}>{commentFetchError}</Alert>:comments?.length<=0?(
        <p className='text-sm my-5 p-3 dark:text-gray-200 dark:bg-gray-600 bg-slate-400 rounded-md text-black' >Be the first one to comment in this post!</p>
    ):(
      <>
        <div className="text-sm my-5 flex items-center gap-1">
            <p className='font-bold lg:text-lg text-md'>Comments</p>
            <div className="border-2 border-gray-400 py-1 px-2 rounded-sm">
                <p>{comments?.length}</p>
            </div>
        </div>
        <hr className='text-gray-500 w-full' />
        <div className="">
            {
                comments.map((comment)=><CommentComponent key={comment._id} postOwnerId={postOwnerId} comment={comment} handleLike={handleLike} handleCommentEdit={handleCommentEdit} handleCommentDelete={handleCommentDelete}/>)
            }
        </div>
      </>
    )}
    </div>

    {showModal && (
        <Modal show={showModal} onClose={()=>{
            // setUserDeleteError(null);
            setShowModal(false)
            }} popup size={"md"}>
            <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-md text-gray-500 dark:text-gray-400 font-bold'>Are you sure you want to delete this comment!?<span className='font-normal text-red-600 rounded-md block border-2 m-1 p-1 border-red-200'>Note: This comment will be permanently lost upon deletion</span>
                    </h3>
                </div>
                <form>
                {commentToDeleteError && <Alert color={"failure"} className='mx-auto my-2 w-[100%]'>{commentToDeleteError}</Alert>}
                {/* <TextInput value={userDeleteConsentInp} required onChange={(e)=>{
                    setUserDeleteConsentInp(e.target.value);
                }} placeholder='Give consent'/>
                <p className="text-sm text-gray-500 font-bold mt-2">Note: All data will be permanently lost upon deletion</p> */}
                <div className="flex justify-between mt-5">
                    <Button disabled={loading} type='submit' color={"failure"} onClick={(e)=>handlePermanentCommentDelete(e,commentToDelete)}>{loading?<><Spinner size={"sm"} className='m-1 ' /> Deleting</>:"Yes I am sure"}</Button>
                    <Button disabled={loading} color={"success"} onClick={()=>{
                        setShowModal(false);
                        // setUserDeleteError(null);
                    }
                    }>No, Cancel</Button>
                </div>
                </form>
            </Modal.Body>

        </Modal>
    )}

   </>
  )
}

export default CommentSection;