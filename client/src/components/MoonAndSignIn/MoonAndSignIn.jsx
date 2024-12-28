import { Avatar, Button, Dropdown } from 'flowbite-react';
import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toggleTheme } from '../../store/theme/themeSlice';
import { signoutUserSuccess } from '../../store/user/userSlice';

function MoonAndSignIn() {
  const dispatch=useDispatch();
  const {currentUser}=useSelector(state=>state.user);
  // console.log(currentUser.userProfileImageUrl,"I am here");
  const {theme}=useSelector(state=>state.theme);
  
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
    
    <div className='flex gap-2 md:order-2'> {/*This makes sure the order is 2 that means this div is in the 2nd place (currently it is at last) when the md size.*/}
        <Button  onClick={()=>dispatch(toggleTheme())} className='w-12 h-10 hidden sm:inline' color={"gray"} pill>
          {theme==='light'?<FaMoon />:<FaSun/>}
        </Button>
    
        {!currentUser?  
        <NavLink to={"/signin"}>
          <Button gradientDuoTone={"purpleToBlue"} outline>Sign in</Button>
        </NavLink>:<Dropdown
        arrowIcon={false} 
        inline
        label={
          <Avatar
            alt='user'
            img={currentUser.userProfileImageUrl}
          />
        }
        >
        <Dropdown.Header>
          <span className='block text-sm' >@{currentUser.username}</span>
          <span className='block text-sm font-medium truncate'>@{currentUser.email}</span>
        </Dropdown.Header>
        
        <Dropdown.Header>
          <NavLink to="/dashboard?tab=profile" >
            <Dropdown.Item>Profile</Dropdown.Item>
          </NavLink>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
        </Dropdown.Header>
        
        </Dropdown>}
    </div>
    
  )
}

export default MoonAndSignIn;