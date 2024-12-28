import React from "react";
import { NavLink } from "react-router-dom";

function BiggerLogo() {
  return (
    <NavLink
      to={"/"}
      className={
        "text-sm sm:text-4xl font-bold dark:text-white"
      }
    >
      <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        Swastik's
      </span>
      Blog
    </NavLink>
  );
}

export default BiggerLogo;
