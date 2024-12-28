import React from 'react'
import { useSelector } from 'react-redux';
function ThemeProvider({children}) {
    const {theme}=useSelector(state=>state.theme);
  return (
    <div className={theme} >
        <div className='min-h-screen bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)]'>
        {/*In Tailwind, the dark class on a parent affects child elements' dark mode styles. */}
        {children}
        </div> 
    </div>
  )
} 

export default ThemeProvider;