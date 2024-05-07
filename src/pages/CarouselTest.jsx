import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import { useGetProductQuery } from '../api/productApi'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { useSelector } from 'react-redux'

const CarouselTest = ({photos}) => {
  const baseUrl = "http://localhost:8000/storage/products/"
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const preBtnHandler = (clickHandler, hasPrev) => (
    <div
      className={`${hasPrev ? "absolute" : "hidden"} left-1 top-1/2 z-50`}
      onClick={clickHandler}
    >
      <div className="p-1 bg-gray-600 active:scale-105 rounded-full border border-gray-700">
      <MdKeyboardArrowLeft className='text-2xl text-white'/>
      </div>
    </div>
  )
  const nextBtnHandler = (clickHandler, hasNext) => (
    <div
      className={`${hasNext ? "absolute" : "hidden"} right-1 top-1/2 z-50`}
      onClick={clickHandler}
    >
      <div className='p-1 bg-gray-600 active:scale-105 rounded-full border border-gray-700'>
        <MdKeyboardArrowRight className='text-2xl text-white'/>

      </div>
    </div>
  )
  return (
    <div className={`border rounded w-[400px] shadow-md  bg-gray-700 ${darkMode && "border-gray-500"}`}>
        <Carousel autoPlay={true} interval="2000" infiniteLoop 
        renderArrowPrev={(clickHandler, hasPrev) => preBtnHandler(clickHandler, hasPrev)}
        renderArrowNext={(clickHandler, hasNext) => nextBtnHandler(clickHandler, hasNext)}
        >
            {
              photos?.map((photo,index) => (
                <div key={index}>
                  <img className='w-[100px]' src={baseUrl + photo?.photo_url} />
                </div>
              ))
            }
        </Carousel>
    </div>
  )
}

export default CarouselTest