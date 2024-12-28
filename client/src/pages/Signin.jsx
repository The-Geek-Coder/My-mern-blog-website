import React, { useState } from "react";
import BiggerLogo from "../components/Logo/BiggerLogo";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import { signInSuccess,signInFailure,signInStart } from "../store/user/userSlice";
import { useSelector } from "react-redux";
import OAuth from "../components/OAuth/OAuth";
function Signin() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [formData,setFormData]=useState({});
  const {loading:isLoading,error:errorMessage,currentUser}=useSelector(state=>state.user); //name of the global state. name:'user'
  // const [errorMessage,setErrorMessage]=useState(null);
  // const [isLoading,setIsLoading]=useState(false);
  function handleChange(e){
    const {name,value}=e.target;
    console.log(e.target.value);
    setFormData((prev)=>({...prev,[name]:value}));
  }
async  function handleClick(e){
    e.preventDefault();
    console.log(formData);
    if( !formData.email || !formData.password){
      return dispatch(signInFailure("Please fill all the fields"));
      // return setErrorMessage("Please fill out all fields");
    }
    try {
      console.log("Here");
      //Signin failure is going to take care of these 2.
      // setIsLoading(true);
      dispatch(signInStart()); //loading true error null.
      // setErrorMessage(null);
      const response=await fetch("/api/auth/signin",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      });
      // if(!response.ok){
      //   return setErrorMessage("username and ");
      // }
      const responseData=await response.json();
      console.log(responseData);
      // setErrorMessage(null);
      // setIsLoading(false);
      if(!response.ok){
        console.log(currentUser,"This is the current user.",response.ok,responseData.msg);
       return dispatch(signInFailure(responseData.msg)); //error and loading false
      //  return setErrorMessage(responseData.msg);
      }
      dispatch(signInSuccess(responseData.user)); //setting the user error null loading false.
      console.log(currentUser,"This is the current user. Here");
      navigate("/");
    // return  setErrorMessage(null);
    } catch (error) {
      dispatch(signInFailure(error.message));
      // setIsLoading(false);
      // return setErrorMessage(error.msg);
    }
  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
        <div className="flex-1">
          <BiggerLogo />
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>

        {/* right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
           
            <div>
            <Label value="Your email"  />
            <TextInput
              type="email"
              placeholder="name@example.com"
              name="email"
              onChange={handleChange}
            />
            </div>
            <div>
            <Label value="Your password"  />
            <TextInput
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
            />
            </div>

            <Button gradientDuoTone={"purpleToPink"}
                    type="submit"
                    onClick={handleClick}
                    disabled={isLoading}
            >
              {
               isLoading? 
               <>
               <Spinner size='sm'/>
                <span className="pl-3">Loading...</span>
               </>
                :"Sign In"
              }
            </Button>

              <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an Account?</span>
            <NavLink to="/signup" className={"text-blue-500"}>Sign Up</NavLink>
          </div>
          {errorMessage?
            <Alert className="mt-5" color={"failure"}>{errorMessage}</Alert>:""
          }
        </div>
      </div>
    </div>
  );
}

export default Signin;
