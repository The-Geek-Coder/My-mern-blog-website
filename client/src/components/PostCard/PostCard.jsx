import React from 'react'
import { NavLink } from 'react-router-dom';

function PostCard({post}) {
    console.log(post.slug);
    
  return (
   <>
    <div className="group relative w-full border border-teal-500 h-[400px] overflow-hidden m-3 rounded-lg sm:w-[430px] md:w-[560px] lg:w-[430px] mx-auto sm:mx-3 transition-all">
        <NavLink to={`/posts/${post.slug}`}>
            <img src={post.image} alt="post thumbnail" className='h-[260px] w-full object-fill group-hover:h-[200px] transition-all duration-300 z-20'/> {/* group-hover means hover over group class div! */}
        </NavLink>
        <div className="p-3 flex flex-col gap-2">
            <h2 className='text-xl font-semibold p-1 pl-3 line-clamp-2'>{post.title}</h2>
            <span className='p-2 rounded-lg border border-gray-400 w-[max-content] mx-2 flex self-end'>{post.category}</span>
            
            <NavLink to={`/posts/${post.slug}`} className={'z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center p-2 py-3 rounded-md !rounded-tl-none m-2'}>
                Read article
            </NavLink>
        </div>
    </div>
   </>
  )
}

export default PostCard;