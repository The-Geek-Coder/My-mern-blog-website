import React, { useState } from "react";
import BiggerLogo from "../components/Logo/BiggerLogo";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth/OAuth";
function Signup() {
  const navigate=useNavigate();
  const [formData,setFormData]=useState({});
  const [errorMessage,setErrorMessage]=useState(null);
  const [isLoading,setIsLoading]=useState(false);
  function handleChange(e){
    const {name,value}=e.target;
    console.log(e.target.value);
    setFormData((prev)=>({...prev,[name]:value}));
  }
async  function handleClick(e){
    e.preventDefault();
    console.log(formData);
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage("Please fill out all fields");
    }
    try {
      console.log("Here");
      setIsLoading(true);
      setErrorMessage(null);
      const response=await fetch("/api/auth/signup",{
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
      setErrorMessage(null);
      setIsLoading(false);
      if(responseData.success==false){
       return setErrorMessage(responseData.msg);
      }
      navigate("/signin");
    return  setErrorMessage(null);
    } catch (error) {
      setIsLoading(false);
      return setErrorMessage(error.msg);
    }
  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
        <div className="flex-1">
          <BiggerLogo />
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
            <Label value="Your username"  />
            <TextInput
              type="text"
              placeholder="username"
              name="username"
              onChange={handleChange} 
            />
            </div>
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
                :"Sign Up"
              }
            </Button>
              <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an Account?</span>
            <NavLink to="/signin" className={"text-blue-500"}>Sign In</NavLink>
          </div>
          {errorMessage?
            <Alert className="mt-5" color={"failure"}>{errorMessage}</Alert>:""
          }
        </div>
      </div>
    </div>
  );
}

export default Signup;
