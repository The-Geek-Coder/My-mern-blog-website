import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/about';
import Home from './pages/home';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Project from './pages/Projects'
import Header from './components/header/header';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import OnlyAdminPrivateRoute from './pages/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import SinglePost from './pages/SinglePost';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import SearchPage from './pages/SearchPage';


function App() {
  return (
    <BrowserRouter>
    <ScrollToTop /> {/* Whenever a route will change it will scroll to the top of that page */}
    <Header />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/search' element={<SearchPage/>}/>

      <Route element={<PrivateRoute/>}> {/*Making the dashboard private */}
      <Route path='/dashboard' element={<Dashboard/>}/>
      </Route>

      <Route element={<OnlyAdminPrivateRoute/>}> {/*Making the dashboard private */}
      <Route path='/createPost' element={<CreatePost/>}/>
      <Route path='/updatePost/:postId' element={<UpdatePost/>}/>
      {/* <Route path='/users' element={<DashUsers/>}/> */}
      </Route>

      <Route path='/projects' element={<Project/>}/>
      <Route path='/posts/:postSlug' element={<SinglePost/>}/>
    </Routes>
    <Footer />
    </BrowserRouter>
  )
}

export default App;