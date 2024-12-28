import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import  'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
function UpdatePost() {
    const [file,setFile]=useState(null);
    // const [imgURL,setImgURL]=useState(null);
    const [formData,setFormData]=useState({});
    const [imageFileUploadProgress,setimageFileUploadProgress]=useState(null);
    const [imageFileUploadError,setimageFileUploadError]=useState(null);
    const [publishError,setPublishError]=useState(null);
    const navigate=useNavigate();
    const {postId}=useParams();
    const {currentUser}=useSelector((state)=>state.user);
    useEffect(()=>{
       const fetchPost=async()=>{
        setPublishError(null);
        try {
            const response=await fetch(`/api/posts/getPosts/?userId=${currentUser._id}&postId=${postId}`);
            const responseData=await response.json();
            if(!response.ok) {
                console.log(responseData.msg);
                setPublishError(responseData.msg)
                return;
            }
            setFormData(responseData.posts[0]);
        } catch (error) {
            console.log(error.message);
        }
       }
       fetchPost();
    },[postId]);

    const uploadImage=async()=>{
        try {
            if(!file){
                setimageFileUploadError(()=>"Please Select an image");
                console.log(imageFileUploadError);    
                return;
            }
            setimageFileUploadError(null);
            const storage=getStorage(app);
            const fileName=new Date().getTime()+'_'+file.name;
            const storageRef=ref(storage,fileName);
            const uploadTask=uploadBytesResumable(storageRef,file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    setimageFileUploadProgress(progress.toFixed(0));
                },
                (error)=>{
                    setimageFileUploadError("Image upload failed");
                    setimageFileUploadProgress(null);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadedUrl)=>{
                        setimageFileUploadError(null);
                        setimageFileUploadProgress(null);
                        // setImgURL(downloadedUrl);
                        setFormData({...formData,image:downloadedUrl});
                    })
                }
            )
        } catch (error) {
            setimageFileUploadError("Image upload failed!");
            setimageFileUploadProgress(null);
            console.error(error.message);
        }
    }

    const scrollToFormErrorDisplay=()=>{
        const errorElement=document.getElementById("formErrorDisplay");
        console.log("Hello returning ",errorElement);
        
        if(!errorElement) return;
        console.log("Hello returning 2");
        
        errorElement.scrollIntoView({
            behavior:"smooth",
            block:"center"
        })
    }

    useEffect(()=>{
        if(publishError!==null) scrollToFormErrorDisplay();
    },[publishError]);
    const handleUpdatePostBtn=async(e)=>{
        e.preventDefault();
        console.log(formData.image);
        
        try {
            setimageFileUploadError(null);
            setPublishError(null);
        //    console.log(formData); 
        console.log(formData.title);
           const response=await fetch(`/api/posts/update/${currentUser._id}/${postId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(formData)
           });
           const responseData=await response.json();
           if(!response.ok){
            setPublishError(responseData.msg);
            // scrollToFormErrorDisplay();
            return;
           }
           setPublishError(null);
        //    navigate(`/posts/${responseData.post._id}`)
           navigate(`/posts/${responseData.updatedPost.slug}`)
        } catch (error) {
            setPublishError("Something went wrong!");
            // scrollToFormErrorDisplay();
        }
    }
  return (
    <div className="p-3  min-h-screen">
    <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
    <form onSubmit={handleUpdatePostBtn} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between m-auto w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw]">
            <TextInput value={formData.title} onChange={(e)=>setFormData(()=>({...formData,title:e.target.value}))} name='title' type='text' placeholder='Title *' required 
                className='flex-1 w-full'/>
            <Select value={formData.category} onChange={(e)=>setFormData(()=>({...formData,category:e.target.value}))}>
                <option value="uncategorized">
                    Select a  category
                </option>
                <option value="javascript">Javascript</option>
                <option value="reactjs">React.js</option>
                <option value="nextjs">Next.js</option>
            </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 rounded-lg border-teal-500 border-dotted p-3 m-auto w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw]">
            <FileInput  disabled={!!imageFileUploadProgress} className='flex-1' name="file" type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0])}/>
            <Button type="button" gradientDuoTone={"purpleToBlue"} size={"sm"} outline onClick={uploadImage} disabled={!!imageFileUploadProgress}>
                {
                    imageFileUploadProgress? 
                    <div className='h-16 w-16'>
                        <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress}%` || "0%"} />
                    </div>
                    : "Upload Image"
                }
            </Button>
        </div>
        {imageFileUploadError && <Alert className='m-auto w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw]' color={"failure"}>{imageFileUploadError}</Alert>}
        {formData.image && (
            <img className='rounded-lg  m-auto w-[90vw] md:w-[70vw] h-80 object-cover' src={formData.image} alt="post thumbnail" />
        ) }
        <ReactQuill value={formData.content} onChange={(value)=>setFormData(()=>({...formData,content:value}))} 
        theme="snow" placeholder='Write something...' className="rounded-lg h-72 mb-12 p-3 m-auto w-[90vw] md:w-[70vw]"  />
        <Button disabled={!!imageFileUploadProgress} type='submit' gradientDuoTone={"purpleToPink"} className='rounded-lg mb-12 p-1  m-auto w-[80vw] md:w-[60vw]'>Update</Button>
        {publishError && <Alert id="formErrorDisplay" className='mt-5 m-auto text-md w-[90vw] md:w-[70vw]' color={"failure"}>{publishError}</Alert>}
    </form>
   </div>
  )
}

export default UpdatePost;