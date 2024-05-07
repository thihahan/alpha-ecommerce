import React from 'react'
import "../css/are-you-sure.css"

const AreYouSure = ({showSureBtn, cancelHandler, actionHandler, actionMessage}) => {
  return (
   <div className="">
    <div className={`absolute h-screen w-screen ${!showSureBtn && "hidden"}`}></div>
     <div className={`fixed top-1/3 left-1/2 flex justify-center items-center ${showSureBtn ? "" : "hidden"}`}>
    <div className='p-5 bg-white border'>
      <h3 className='text-center mb-3'>Are You Sure?</h3>
      <div className='flex gap-3'>
          <button className="button" onClick={() => cancelHandler()}>Cancel</button>
          <button className="button delete" onClick={() => actionHandler()}>
          {
            actionMessage ? actionMessage : "Delete"
          }
          </button>
      </div>
      </div>
      
    </div>
   </div>
  )
}

export default AreYouSure