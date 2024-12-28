import React from 'react'
import { Navbar } from 'flowbite-react'
import { NavLink, useLocation } from 'react-router-dom'

function Menu() {
    const path=useLocation().pathname;

  return (
    <Navbar.Collapse>
        <Navbar.Link active={path==="/"} as={"div"}> {/*We cannot keep to NavLink or anchor tag this gives error so we convert this as  a div. */}
        <NavLink to={"/"}>
                Home
         </NavLink>
        </Navbar.Link>
        
        <Navbar.Link active={path==="/about"}  as={"div"}>
        <NavLink to={"/about"}>
            About
         </NavLink>
        </Navbar.Link>

        <Navbar.Link active={path==="/projects"}  as={"div"}>
        <NavLink to={"/projects"}>
                Projects
         </NavLink>
        </Navbar.Link>

    </Navbar.Collapse>
  )
}

export default Menu; 