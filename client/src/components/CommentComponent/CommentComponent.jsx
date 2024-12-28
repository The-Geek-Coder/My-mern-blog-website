import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import {Alert, Button, Textarea} from "flowbite-react";
import { useSelector } from "react-redux";
function CommentComponent({ comment, handleLike, handleCommentEdit, handleCommentDelete,postOwnerId }) {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent,setEditedContent]=useState(comment.content);
  const [loading,setLoading]=useState(false);
  const [errorEditing,setErrorEditing]=useState(null);
  // const [showModal,setShowModal]=useState(false);
  console.log(user,currentUser);
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/u/${comment.userId}`);
        const responseData = await response.json();
        if (!response.ok) {
          return;
        }
        console.log(user?.length);
        setUser(responseData.user);
      } catch (error) {}
    };

    getUser();
  }, [comment]);

  const handleEdit = () => {
    if (
      !currentUser &&
      !(
        currentUser.isSupreme ||
        currentUser.isAdmin ||
        currentUser._id === user._id
      )
    )
      return;

    setErrorEditing(null);
    setLoading(false);
    setIsEditing(true);
  };

  const handleSave=async()=>{
    try {
        setErrorEditing(null);
        setLoading(true);
        const response=await fetch(`/api/comments/editComment/${comment._id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({content:editedContent})
        });
        const responseData=await response.json();
        if(!response.ok){
            setLoading(false);
            setErrorEditing(responseData.msg);
            return;
        }
        handleCommentEdit(comment,editedContent);
        setEditedContent(editedContent);
        setErrorEditing(false);
        setLoading(false);
        setIsEditing(false);
    } catch (error) {
     setErrorEditing("Something went wrong try again!");  
     setLoading(false);
    }
  }

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        {" "}
        {/*flex-shrink 0 means the div will not shrink at all. */}
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user?.userProfileImageUrl}
          alt="profile image"
        />
      </div>

      <div className="">
        <div className="flex items-center mb-1">
          <span
            className={`font-bold mr-1 text-xs truncate ${
              user?.isSupreme ? "text-green-600" : ""
            }`}
          >
            {user
              ? user.isSupreme
                ? "Supreme".toUpperCase()
                : `@${user?.username}`.toLowerCase()
              : "Anonymous"}
          </span>
          <span className="text-gray-500 text-xs">
            {
              moment(
                comment.createdAt
              ).fromNow() /*Used for the 2days ago and etc. */
            }
          </span>
        </div>

        {isEditing ? (
          <>
          <Textarea className="w-full text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none focus:bg-gray-100 m-2"
          rows={"3"}
          cols={"100"}
          value={editedContent}
          onChange={(e)=>{
            setLoading(false);
            setErrorEditing(false);
            setEditedContent(e.target.value)
        }}
          ></Textarea>
          {errorEditing && <Alert color={"failure"} className="p-2 m-2 w-full">{errorEditing}</Alert>}
          <div className="flex justify-end gap-2 m-1 items-center">
            <Button 
            type="button"
            size="sm"
            gradientDuoTone={"purpleToBlue"}
            onClick={(e)=>handleSave()}
            disabled={loading}
            >Save</Button>

            <Button  type="button"
            size="sm"
            gradientDuoTone={"purpleToBlue"}
            outline
            onClick={()=>setIsEditing(false)}
            disabled={loading}
            >Cancel</Button>
          </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2 dark:text-gray-400">
              {comment.content}
            </p>

            {/*likes section */}
            <div className="flex gap-1 flex-wrap items-center ">
              <button
                type="button"
                onClick={() => handleLike(comment._id)}
                className={`dark:text-gray-400 text-gray-500 hover:text-blue-500 dark:hover:text-gray-100 
        ${
          currentUser && comment.likes.includes(currentUser._id)
            ? "!text-blue-600  dark:!text-green-400 scale-125 transition-all"
            : ""
        }
    `}
              >
                {/* <FaRegThumbsUp /> */}
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="dark:text-gray-400 text-gray-500 text-sm p-1">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes == 1 ? "Like" : "Likes")}
              </p>

              <div className="flex gap-2">
              {currentUser &&
                (currentUser.isSupreme ||
                  (currentUser.isAdmin &&
                    currentUser._id === postOwnerId  && !user?.isSupreme) ||
                  currentUser._id === user?._id) && (
                  <button
                    onClick={handleEdit}
                    type="button"
                    className="text-slate-400 hover:text-blue-500 font-semibold"
                    disabled={loading}
                  >
                    Edit
                  </button>
                )}

              {currentUser &&
                (currentUser.isSupreme ||
                  (currentUser.isAdmin &&
                  currentUser._id === postOwnerId && !user?.isSupreme) || currentUser._id===user?._id) && (
                  <button
                    onClick={()=>handleCommentDelete(comment._id)}
                    type="button"
                    className="text-slate-400 hover:text-red-500 font-semibold"
                    disabled={loading}
                    
                  >
                    Delete
                  </button>
                )}
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CommentComponent;
