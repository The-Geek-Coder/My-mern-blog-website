import { Button } from 'flowbite-react';
import React from 'react'

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 flex justify-center flex-col ">
            <h2 className='text-2xl'>
                Want to listen to music ad free for $0?
            </h2>
            <p className='text-gray-500 my-2'> Checkout mySpotify-justmusic (mySpotify-No ads, just music)</p>
            <Button gradientDuoTone={'purpleToPink'} className='rounded-tl-xl rounded-bl-none'>
                <a href="https://myspotify-justmusic.netlify.app/" target='_blank' rel='noopener noreferrer'>mySpotify-justmusic</a>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <a href="https://myspotify-justmusic.netlify.app/" target='_blank' rel='noopener noreferrer'><img src="/mySpotifyThumbnail.png" alt="thumbnail" className='rounded-lg' /></a>
        </div>
    </div>
  )
}

export default CallToAction;