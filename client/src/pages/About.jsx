import React from 'react'

function About() {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-2xl mx-auto p-3 text-center">
      <div className="">
        <h1 className='text-3xl font-semibold text-center my-7'>About Swastik's Blog</h1>
        <div className="text-md  text-gray-600 dark:text-gray-400 flex flex-col gap-6">
          <p>
          Welcome to Swastik's Blog, your ultimate destination for exploring the exciting world of web development and technology! Our blog is a hub for developers of all levels, providing a wealth of engaging articles, tutorials, and resources designed to inspire and educate. Whether you’re just starting your coding journey or are an experienced developer, we strive to offer insights that cater to your needs.
          </p>

          <p>At Swastik's Blog, we believe in the power of community and collaboration. Our passionate team is dedicated to demystifying complex concepts and sharing practical tips that empower you to build amazing projects. We cover a wide range of topics, from web frameworks and programming languages to the latest trends in artificial intelligence and machine learning, ensuring that you stay updated in this fast-paced industry.</p>

          <p>Join us as we explore the ever-evolving tech landscape together! We invite you to engage with our content, share your thoughts, and become part of our vibrant community of tech enthusiasts. Let’s learn, create, and innovate together, one blog post at a time!</p>
        </div>
      </div>
    </div>
   </div>
  )
}

export default About;