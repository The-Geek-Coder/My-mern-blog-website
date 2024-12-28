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

function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore,setShowMore]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [commentDeleteError,setCommentDeleteError]=useState(null);
//   const [CommentDeleteConsentInp,setCommentDeleteConsentInp]=useState(null);
  const [commentIdToDelete,setCommentIdToDelete]=useState(null);
//   const [CommentNameToDelete,setCommentNameToDelete]=useState(null);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setShowMore(true);
        const response = await fetch(
          `/api/comments/getComments`
        );
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) return;

        setComments(responseData.comments);
        // alert(responseData.comments[0].isSupreme);
        
        if(responseData.comments.length<9) setShowMore(false);
        console.log(comments, "Hello there guys");
      } catch (error) {
        console.log(error.message);
        
      }
    };
    if(comments.length===0) {
        setShowMore(false);
    }
    if (currentUser.isAdmin) fetchComments();
  }, [currentUser._id]);

  const handleShowMore=async ()=>{
    const startIndex=comments.length;
    try {
        const response = await fetch(
            `/api/comments/getComments?startIndex=${startIndex}`
          );
          const responseData = await response.json();
          console.log(responseData);
          if (!response.ok) return;
          if(responseData.comments.length<9) setShowMore(false);
          console.log(comments, "Hello there guys");
          setComments((prev)=>[...prev,...responseData.comments]);
    } catch (error) {
        console.log(error.message);
    }
  }

  const handleDeleteComment=async(e)=>{
    e.preventDefault();
//    alert(commentIdToDelete);
   try {
    // console.log(CommentDeleteConsentInp);
    const response=await fetch(`/api/comments/deleteComment/${commentIdToDelete}`,{
        method:"DELETE",
        // headers:{
        //     "Content-Type":"application/json"
        // },
        // body:JSON.stringify({deleteCommentConsent:CommentDeleteConsentInp})
    });
    const responseData=await response.json();
    if(!response.ok) {
        setCommentDeleteError(responseData.msg);
        return;
    }
    setComments((prev)=>prev.filter((Comment)=>Comment._id!==commentIdToDelete));
    setShowModal(false);
    // CommentDeleteConsentInp("");
   } catch (error) {
    
   }
  }

  return (
    <>
      <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar-track-slate-700 scrollbar-thumb-slate-500 md:w-[70vw]">
        {currentUser.isAdmin && comments.length > 0 ? (
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>
                Date updated <div className="mt-1">(dd/mm/yyyy)</div>
              </Table.HeadCell>
              {/* <Table.HeadCell>Post</Table.HeadCell> */}
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>Post Id</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              {/* <Table.HeadCell>edit</Table.HeadCell> */}
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {formatDateToDDMMYYYY(comment.updatedAt)}
                  </Table.Cell>

                  {/* <NavLink to={`/posts/${post.slug}`}>
                    <Table.Cell>
                      <img
                        className="h-10 w-20 object-cover bg-gray-500"
                        src={post.image}
                        alt={post.title}
                      />
                    </Table.Cell>
                  </NavLink> */}

                    <Table.Cell >{comment.content}</Table.Cell>

                    <Table.Cell className="text-center">{comment.numberOfLikes}</Table.Cell>

                  <Table.Cell>{comment._id}</Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white text-center">
                    {
                    comment.userId._id ? (comment?.userId.isSupreme)?"SUPREME ID":comment.userId._id:"--"
                   }
                  </Table.Cell>
                  {/* <Table.Cell>{Comment.isAdmin?<FaCheck className="text-green-500" />:<FaTimes className="text-red-600" />}</Table.Cell> */}

                  {/* <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {
                     (currentUser._id!==Comment._id)?
                     (!Comment.isSupreme?Comment.Commentname:"SUPREME")
                    :(Comment.isSupreme?"YOU (supreme)":`(YOU) ${Comment.Commentname} `)
                  }
                  </Table.Cell> */}

                  {/* <Table.Cell>{(!Comment.isAdmin || !Comment.isSupreme) && <span>{Comment.email}</span>}</Table.Cell> */}

                  <Table.Cell>
                    {
                    (!comment.userId.isSupreme || currentUser.isSupreme) &&
                        <button disabled={currentUser._id===Comment._id} onClick={()=>{
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                        // setCommentNameToDelete(Comment.Commentname);
                    }} className={`cursor-pointer hover:underline ${currentUser._id===Comment._id?"text-red-800":"text-red-600"}`}>Delete</button>
                    }
                  </Table.Cell>

                  {/* <NavLink className={"text-teal-500 hover:underline hover:cursor-pointer"} to={`/updateComment/${Comment._id}`}>
                    <Table.Cell>
                      <span>Edit</span>
                    </Table.Cell>
                  </NavLink> */}

                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        ) : (
          <p className="font-extrabold dark:text-gray-400 text-gray-500 text-center text-3xl pt-7">No comments to show.</p>
        )}
        {showMore && comments.length>0 &&
            <button onClick={handleShowMore} className="w-full text-teal-500 text-center self-center text-sm py-4 m-1 dark:bg-gray-700 bg-slate-100 rounded-lg">Show More</button>
        }
        
      </div>

       <Modal show={showModal} onClose={()=>{
            setCommentDeleteError(null);
            setShowModal(false)
            }} popup size={"md"}>
            <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-md text-gray-500 dark:text-gray-400 font-semibold text-xl'>Are you sure you want to delete this comment!? <span className='font-normal text-red-600 rounded-md text-lg block'>Note: This comment will be deleted permanently!!</span></h3>
                </div>
                <form>
                {commentDeleteError && <Alert color={"failure"} className='mx-auto my-2 w-[100%]'>{commentDeleteError}</Alert>}
                {/* <TextInput value={CommentDeleteConsentInp} required onChange={(e)=>{
                    setCommentDeleteConsentInp(e.target.value);
                }} placeholder='Give consent'/> */}
                {/* <p className="text-sm text-gray-500 font-bold mt-2">Note: All data will be permanently lost upon deletion</p> */}
                <div className="flex justify-between mt-5">
                    <Button type='submit' color={"failure"} onClick={handleDeleteComment}>Yes I am sure</Button>
                    <Button color={"success"} onClick={()=>{
                        setShowModal(false);
                        setCommentDeleteError(null);
                    }
                    }>No, Cancel</Button>
                </div>
                </form>
            </Modal.Body>

        </Modal>
    </>
  );
}

export default DashComments;
