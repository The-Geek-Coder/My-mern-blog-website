import { Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
function Search() {
  const [searchTerm,setSearchTerm]=useState("");
  const path=useLocation().pathname;
  const location=useLocation();
  const navigate=useNavigate();
  
  useEffect(() => {
    const urlParams=new URLSearchParams(location.search); //all url 
    const searchTermFromUrl=urlParams.get("searchTerm");
    
    if(searchTermFromUrl) setSearchTerm(searchTermFromUrl);



  }, [location.search]); //location search is all data inside location
  

  const handleFormSubmit=async (e)=>{
    e.preventDefault();
    try {
      const urlParams=new URLSearchParams(location.search); //all url 
      urlParams.set("searchTerm",searchTerm);
      const searchQuery=urlParams.toString();
      console.log(urlParams,"search query",searchQuery); // URLSearchParams {size: 1}     "search query" searchTerm=Hello
      navigate(`/search?${searchQuery}`);
      
    } catch (error) {
      
    }
  }

  return (
    <>
      <form onSubmit={(e)=>handleFormSubmit(e)} >
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color={"gray"}>
        <AiOutlineSearch className="self-center" />
      </Button>
    </>
  );
}
//You can mention wether to keep the icon in the right or in the left or if you write icon it will be in the left by defaul.
export default Search;
