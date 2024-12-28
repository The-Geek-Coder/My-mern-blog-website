import React from "react";
import { NavLink } from "react-router-dom";

function Logo() {
  return (
    <NavLink
      to={"/"}
      className={
        "whitespace-nowrap text-center text-sm sm:text-xl font-semibold dark:text-white"
      }
    >
      <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        Swastik's
      </span>
      Blog
    </NavLink>
  );
}

export default Logo;
