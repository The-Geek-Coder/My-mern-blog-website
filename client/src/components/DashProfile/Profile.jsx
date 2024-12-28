import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserSuccess, updateFailure, updateStart, updateSuccess } from '../../store/user/userSlice';
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {NavLink, useNavigate} from "react-router-dom";
function DashProfile() {
    const {currentUser}=useSelector(state=>state.user);
    const dispatch=useDispatch();
    const [imageFile,setImageFile]=useState(null);
    const [imageFileUrl,setImageFileUrl]=useState(null);
    const [imageFileUploadProgress,setimageFileUploadProgress]=useState(null);
    const [imageFileUploadError,setimageFileUploadError]=useState(null);
    const [formData,setFormData]=useState({});
    const [loading,setLoading]=useState(false);
    console.log(imageFileUploadProgress,imageFileUploadError,imageFileUrl);
    const [updateUserSuccess,setUpdateUserSuccess]=useState(false);
    const [updateUserError,setUpdateUserError]=useState(null);
    const [showModal,setShowModal]=useState(false);
    const [userDeleteConsentInp,setUserDeleteConsentInp]=useState("");
    const [userDeleteError,setUserDeleteError]=useState(null);
    const navigate=useNavigate();
    const filePickerRef=useRef(null);
    //added by me
    function getColor(n) {
        // Ensure n is within the range 0 to 100
        n = Math.max(0, Math.min(100, n));
      
        let r, g, b;
      
        if (n <= 50) {
          // Transition from Red to Yellow
          r = 255; // Red remains at maximum
          g = Math.round(n * 5.1); // Green transitions from 0 to 255
          b = 0; // Blue remains at minimum
        } else {
          // Transition from Yellow to Green
          r = Math.round(255 - (n - 50) * 5.1); // Red transitions from 255 to 0
          g = 255; // Green remains at maximum
          b = 0; // Blue remains at minimum
        }
      
        // Return the RGB color in the format "rgb(r, g, b)"
        return `rgb(${r}, ${g}, ${b})`;
      }
      
      // Example usage:
      const number = 75; // Replace this with any number between 0 and 100
      const color = getColor(number);
      console.log(color); // Output the RGB color
      

    const handleProfileImg=(e)=>{
        const file=e.target.files[0];
        if(file){
            console.log("I entered the file part",file);
        setImageFile(file);
        const imgURL = URL.createObjectURL(file); //This is going to create a url for me. INBUILT JS METHOD.
        console.log(imgURL)
        setImageFileUrl(imgURL); 
        console.log("I am the image link: ",imageFileUrl); //This will be the output for example: blob:http://localhost:5173/6206c2f0-06b5-4209-86f7-83d73c6c40f7
        //the blog: must be there at the front if you want to get the image.
    }
    };
    // // console.log(imageFile);
    // console.log("I am the image link:",imageFileUrl);

    // useEffect(()=>{
    //     if(imageFile){
    //         console.log();
            
    //         uploadImage();
    //     }
    // },[imageFile]);

    useEffect(() => {
        // This will run whenever `imageFileUrl` is updated
        console.log("I am the image link: ", imageFileUrl);
        if(imageFileUrl)
        setFormData((prevData) => ({
            ...prevData,
            userProfileImageUrl: imageFileUrl,
          }));
    }, [imageFileUrl]);

    function uploadImage(){
        return new Promise((resolve, reject) => {
        if(!imageFile){
            console.log(imageFile,"null")
            resolve();
            return;
        }
        if (!imageFile.type.startsWith('image/')) {
            console.log("I am here inside the image/");
            
            setimageFileUploadError("Please upload a valid image.");
            setimageFileUploadProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
            resolve();
            return;
        }
        // console.log("uploading image");
        setimageFileUploadError(null);
        const storage=getStorage(app); //With the help of app firebase is going to understand that the correct person is requesting to upload image.
        const fileName=new Date().getTime()+imageFile.name;
        const storageRef=ref(storage,fileName);
        const uploadTask=uploadBytesResumable(storageRef,imageFile); //Method used to upload image and we get the info while it is uploading. Like amount of bytes we uploaded, etc.
        uploadTask.on(
            'state_changed',
           (snapshot)=>{
            //We can get how many percentage of data has been uploaded. AMAZING RIGHT I KNOW HEHE...
                const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100; //formula to find percentage of file transfered.
                //we need to round and remove the decimals from progress.
                console.log("Entered the snapshot");
                
                setimageFileUploadProgress(progress.toFixed(0));
           },
           (error)=>{
            console.log("I am here inside the error/");
                setimageFileUploadError("Image uploading failed file must be less than 2MB");
                // setImageFileUrl(currentUser.userProfileImageUrl);
                setimageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                resolve();
                // reject();
                return;
           }, 
        ()=>{ //feedback
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                setImageFileUrl(downloadURL); //getting the url finally.
                console.log("Hello I am about to resolve",new Date().getSeconds());
                resolve(downloadURL);
                return;
            }).catch(reject);
        } 
    );
    })
    }

    const handleBtnClick=async (e)=>{
        e.preventDefault();
        setLoading(true);
        // console.log("Hello there");
       await uploadImage();
    //    alert("Hello there")
    //    console.log(out,"Not reaching here");
    if(imageFileUrl) setFormData((prevData)=>({...prevData,userProfileImageUrl:imageFileUrl}));
        console.log("Hello there after wait");
        // setFormData((prevData)=>({...prevData,userProfileImageUrl:imageFileUrl}));
        // console.log(imageFileUrl,"Hello I am about to resolve",new Date().getSeconds());
        console.log(formData,"This is the form data");

        if(Object.keys(formData).length===0){
            console.log("Returning due to empty");
            setUpdateUserError("No changes made");
            setLoading(false);
            setimageFileUploadProgress(null);
            setImageFile(null);
            return;
        }
        try {
            setUpdateUserError(null);
            setUpdateUserSuccess(false)
            dispatch(updateStart());
            const response=await fetch(`/api/u/update/${currentUser._id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    
                },
                body:JSON.stringify(formData)
            });
            const responseData=await response.json();
            if(!response.ok){
                dispatch(updateFailure(responseData.msg));
                setUpdateUserSuccess(false);
                setUpdateUserError(responseData.msg);
            }
            else{
            dispatch(updateSuccess(responseData.user));
           setUpdateUserSuccess(true)
           setUpdateUserError(null);
            }
        } catch (error) {
           dispatch(updateFailure("Cannot update something went wrong!!"));
           setUpdateUserSuccess(false)
           setUpdateUserError("Cannot update something went wrong");
        }
        setLoading(false);
        setimageFileUploadProgress(null);
        setImageFile(null);
    }

    const handleDeleteUser=async(e)=>{
        e.preventDefault();
        try {
            dispatch(deleteUserStart());
            setUserDeleteError(null);
            const response=await fetch(`/api/u/delete/${currentUser._id}`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({deleteUserConsent:userDeleteConsentInp})
            });
            const responseData=await response.json();
            if(!response.ok){
                dispatch(deleteUserFailure(responseData.msg));
                // alert("Entered");
                console.log(responseData);
                setUserDeleteError(responseData.msg);
            }
            else{
            setShowModal(false);
            dispatch(deleteUserSuccess());
            }
        } catch (error) {
            dispatch(deleteUserFailure("Something went wrong while deletion"))
            setUserDeleteError("Something Went Wrong");
        }
    } 
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
    <form onSubmit={(e)=>handleBtnClick(e)} className='flex flex-col gap-4 w-[95%] md:w-[80%] mx-auto xl:w-[50%]'>
    <h1  className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <input type="file" accept='image/*' onChange={handleProfileImg} ref={filePickerRef} hidden/> {/*We are hiding this because it's reference is given to the image div so if that is clicked this elements click function will be called. */}
    <div className="w-36 h-36 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative" onClick={()=>filePickerRef.current.click()}> {/*So when this div is clicked we are going to call the click function of the reference that means if this div is clicked it means the input file that it is refering to that inputs click function will be called.*/}
        {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
            strokeWidth={5}
            styles={{
                root:{
                    width:"100%",
                    height:"100%",
                    position:"absolute",
                    top:0,
                    left:0
                },
                path:{
                    stroke:`${getColor(imageFileUploadProgress)}`
                }
            }}
            />
        )}
    <img src={imageFileUrl || currentUser.userProfileImageUrl} alt="profile image" className={`rounded-full border-8 h-full w-full border-[lightgray] object-cover 
        ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}
        `}/>
    </div>
    {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
    <TextInput type='text' name='username' placeholder='username' defaultValue={currentUser.username} onChange={(e)=>{
        setFormData((prevData)=>({...prevData,username:e.target.value}))
        console.log(formData)
    }} />
    <TextInput type='text' name='email' placeholder='email' defaultValue={currentUser.email} disabled title='Email cannot be changed' />
    <TextInput type='text' name='password' placeholder='Change password' onChange={()=>{
        setFormData((prevData)=>({...prevData,password:e.target.value}))
    }} />
    <Button type='submit' gradientDuoTone={"purpleToBlue"} outline  disabled={loading}>
            {
               loading? 
               <>
               <Spinner size='sm'/>
                <span className="pl-3">Loading...</span>
               </>
                :"Update"
              }
        </Button>
        {
       ! updateUserError && updateUserSuccess && (
            <Alert color={"success"} className='mt-5 w-[100%]'>User Profile updated successfully</Alert>
        )
        }
        {
        !updateUserSuccess && updateUserError && (
            <Alert color={"failure"} className='mt-5 w-[100%]'>{updateUserError}</Alert>
        )
        }

       {
            currentUser.isAdmin && (
                <NavLink to="/createPost"> 
                    <Button 
                    type='button'
                    gradientDuoTone={"tealToLime"}
                    size={"xl"}
                    className='w-full'
                    >
                    Create a Post
                    </Button>
                </NavLink>
            )
        }
    </form>
    <div className="text-red-500 flex justify-around mt-8 items-center py-3 gap-4 w-[95%] md:w-[80%] mx-auto">
        <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
    </div>
    {showModal && (
        <Modal show={showModal} onClose={()=>{
            setUserDeleteError(null);
            setShowModal(false)
            }} popup size={"md"}>
            <Modal.Header/>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-md text-gray-500 dark:text-gray-400'>To delete this account type: <span className='font-bold text-red-600 rounded-md block'>"I WanT To DeLeTe mY acCoUnt"</span> as a form of consent</h3>
                </div>
                <form>
                {userDeleteError && <Alert color={"failure"} className='mx-auto my-2 w-[100%]'>{userDeleteError}</Alert>}
                <TextInput value={userDeleteConsentInp} required onChange={(e)=>{
                    setUserDeleteConsentInp(e.target.value);
                }} placeholder='Give consent'/>
                <p className="text-sm text-gray-500 font-bold mt-2">Note: All data will be permanently lost upon deletion</p>
                <div className="flex justify-between mt-5">
                    <Button type='submit' color={"failure"} onClick={handleDeleteUser}>Yes I am sure</Button>
                    <Button color={"success"} onClick={()=>{
                        setShowModal(false);
                        setUserDeleteError(null);
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

export default DashProfile;