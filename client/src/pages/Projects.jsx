import React from 'react'
import CallToAction from '../components/CallToAction/CallToAction'

function Project() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto p-3 gap-6 flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-semibold my-3 text-center'>Projects</h1>
      <p className='text-md text-gray-600 dark:text-gray-400'>This is a music web app, where you can listen to ad free music for FREE!</p>
      <CallToAction/>
    </div>
  )
}

export default Project