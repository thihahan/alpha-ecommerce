import React, { useState } from 'react'

const Action = ({text,icon, actionHandler, textColor}) => {
  const [showText, setShowText] = useState(false)
  return (
     <div className="relative">
      <div className='active:scale-105' 
      onClick={actionHandler}
      >
          <span 
          onMouseMove={() => setShowText(true)}
          onMouseLeave={() => setShowText(false)}
          className={`text-2xl cursor-pointer ${textColor} font-bold`}>
              {icon}
          </span>


      </div>
      <span 
      className={`text-sm absolute -right-2 -top-7 px-2 py-1 rounded bg-gray-100 ${!showText && "hidden"}`}>{text}</span>
    </div>
  )
}

export default Action