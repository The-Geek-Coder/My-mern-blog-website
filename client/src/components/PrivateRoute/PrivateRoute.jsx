import { useSelector } from 'react-redux';
import {Outlet, Navigate} from 'react-router-dom'
function PrivateRoute() {
    // const navigate=useNavigate();
    //difference between useNavigate and Navigate is Navigate is a component and useNavigate() is like a function.
    const {currentUser}=useSelector(state=>state.user);
  return ( 
    currentUser?<Outlet/>:<Navigate to={"/signin"}/>
    )
}

export default PrivateRoute;