import { Button, Navbar } from "flowbite-react";
import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
// import { AiOutlineSearch } from "react-icons/ai";
// import { FaMoon } from "react-icons/fa";
import MoonAndSignIn from "../MoonAndSignIn/MoonAndSignIn";
import Menu from "../Menu/Menu";
function Header() {
  return (
    <Navbar className="border-b-2">
      <Logo />
      <Search />
      <MoonAndSignIn />
      <Navbar.Toggle/> {/*Will show the hamburger menu when the menu is hidden. */}
      <Menu />
    </Navbar>
  );
}

export default Header;
