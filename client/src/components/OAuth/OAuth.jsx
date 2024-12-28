import { Button } from 'flowbite-react';
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai';
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { app } from '../../firebase';
import { signInFailure, signInSuccess } from '../../store/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function OAuth() {
    const auth=getAuth(app); //who is requesting for the auth.
    const dispatch=useDispatch();
    const navigate=useNavigate();
  const  handleGoogleClick=async()=>{
    const provider=new GoogleAuthProvider();
    provider.setCustomParameters({prompt:'select_account'}); //everytime the user clicks continue with google we will allow the user to choose the account instead of fixing the account  with which they first signed in. 
    try {
        const resultFromGoogle=await signInWithPopup(auth,provider);
        console.log(resultFromGoogle,"hello");
        console.log(resultFromGoogle.user.displayName,resultFromGoogle.user.photoURL);
        const response=await fetch("/api/auth/google",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:resultFromGoogle.user.displayName,
                email:resultFromGoogle.user.email,
                googlePhotoUrl:resultFromGoogle.user.photoURL,
            }),
        });
        const responseData=await response.json();
        if(!response.ok){
            return dispatch(signInFailure(responseData.msg));
         }
         console.log(responseData.user);
        //  alert(resultFromGoogle.user.photoURL)
         dispatch(signInSuccess(responseData.user));
         navigate("/");
    } catch (error) {
           console.error("Error occured while signin refresh!!");
          //  return dispatch(signInFailure("Error occured while signin refresh!!"));
    }
    }
  return (
    <Button onClick={handleGoogleClick} type='button' gradientDuoTone={"pinkToOrange"} outline >
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        <span>Continue with Google</span>
    </Button>
  )
}

export default OAuth;